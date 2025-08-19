from fastapi import HTTPException, Depends, Request
from config.database import get_db_connection
from repositories.user_repositories import UserRepository
from utils.password_utils import hash_password
import jwt as pyjwt
import uuid
import requests
from jose import jwt as jose_jwt
from jose.exceptions import JWTError
import config.settings as settings


def verify_token(token: str):
    try:
        # If AUTH0_DOMAIN and AUTH0_AUDIENCE are configured, validate using JWKS (RS256)
        auth0_domain = getattr(settings, "AUTH0_DOMAIN", None)
        auth0_audience = getattr(settings, "AUTH0_AUDIENCE", None)
        algorithms = getattr(settings, "ALGORITHMS", None) or [
            getattr(settings, "ALGORITHM", "RS256")
        ]

        if auth0_domain and auth0_audience:
            jwks_url = f"https://{auth0_domain}/.well-known/jwks.json"
            jwks = requests.get(jwks_url, timeout=5).json()
            unverified_header = jose_jwt.get_unverified_header(token)
            rsa_key = {}
            for key in jwks.get("keys", []):
                if key.get("kid") == unverified_header.get("kid"):
                    rsa_key = {
                        "kty": key.get("kty"),
                        "kid": key.get("kid"),
                        "use": key.get("use"),
                        "n": key.get("n"),
                        "e": key.get("e"),
                    }
                    break
            if not rsa_key:
                raise HTTPException(status_code=401, detail="Invalid token header")

            payload = jose_jwt.decode(
                token,
                rsa_key,
                algorithms=algorithms,
                audience=auth0_audience,
                issuer=f"https://{auth0_domain}/",
            )
            return payload

        # Fallback: symmetric key decode (HS256 or configured ALGORITHM)
        secret = getattr(settings, "SECRET_KEY", None)
        alg = getattr(settings, "ALGORITHM", "HS256")
        if not secret:
            raise HTTPException(
                status_code=500, detail="Server token configuration missing"
            )

        payload = pyjwt.decode(token, secret, algorithms=[alg])
        return payload

    except requests.RequestException:
        raise HTTPException(status_code=503, detail="Unable to fetch JWKS")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user(request: Request, db=Depends(get_db_connection)):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = auth_header.split(" ")[1]
    payload = verify_token(token)

    # Map first the OIDC (Auth0) ID -> "sub", fallback to "user_id"
    auth0_id = payload.get("sub") or payload.get("user_id")
    # Use the provided PostgreSQL connection
    user_repo = UserRepository(db)
    user = user_repo.find_by_user_id(auth0_id)

    if not user:
        # Auto-register
        email = payload.get("email")
        full_name = (
            payload.get("fullName")
            or payload.get("name")
            or (email.split("@")[0] if email else None)
        )
        random_pw = str(uuid.uuid4())
        hashed = hash_password(random_pw)

        user_repo = UserRepository(db)
        new_id = user_repo.create_user(
            full_name,
            email,
            hashed,
            phone=None,
            address=None,
            role="user",
            user_timezone="UTC",
            auth0_id=auth0_id,
        )
        user = user_repo.find_by_user_id(auth0_id)
    return user


def get_current_token(request: Request) -> str:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = auth_header.split(" ")[1]
    return token
