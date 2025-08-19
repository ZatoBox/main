from fastapi import HTTPException, Depends, Request
from config.database import get_db_connection
from repositories.user_repositories import UserRepository
from utils.password_utils import hash_password
from jose import jwt as jose_jwt
from jose.exceptions import JWTError
import requests
import jwt as pyjwt
import uuid
import config.settings as settings
from datetime import datetime, timedelta


def verify_token(token: str):
    try:
        auth0_domain = getattr(settings, "AUTH0_DOMAIN", None)
        auth0_audience = getattr(settings, "AUTH0_AUDIENCE", None)
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
            if rsa_key:
                payload = jose_jwt.decode(
                    token,
                    rsa_key,
                    algorithms=[getattr(settings, "ALGORITHM", "RS256")],
                    audience=auth0_audience,
                    issuer=f"https://{auth0_domain}/",
                )
                return payload
    except requests.RequestException:
        pass
    except JWTError:
        pass
    try:
        secret = getattr(settings, "SECRET_KEY", None)
        alg = getattr(settings, "ALGORITHM", "HS256")
        if not secret:
            raise HTTPException(status_code=401, detail="Invalid token")
        payload = pyjwt.decode(token, secret, algorithms=[alg])
        return payload
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def fetch_userinfo(token: str):
    with requests.Session() as s:
        headers = {"Authorization": f"Bearer {token}"}
        domain = getattr(settings, "AUTH0_DOMAIN", None)
        if not domain:
            return {}
        url = f"https://{domain}/userinfo"
        try:
            r = s.get(url, headers=headers, timeout=5)
            if r.status_code == 200:
                return r.json()
        except requests.RequestException:
            return {}
    return {}


def _build_local_token_for_user(user: dict) -> str:
    secret = getattr(settings, "SECRET_KEY", "zatobox")
    alg = getattr(settings, "ALGORITHM", "HS256")
    exp_minutes = int(getattr(settings, "ACCESS_TOKEN_EXPIRE_MINUTES", 60))
    payload = {
        "sub": str(user.get("auth0_id") or user.get("id")),
        "user_id": user.get("id"),
        "email": user.get("email"),
        "exp": datetime.utcnow() + timedelta(minutes=exp_minutes),
    }
    token = pyjwt.encode(payload, secret, algorithm=alg)
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token


def ensure_user_from_payload(token: str, payload: dict, db):
    auth0_id = payload.get("sub") or payload.get("user_id")
    user_repo = UserRepository(db)
    user = user_repo.find_by_user_id(auth0_id)
    if user:
        try:
            user["access_token"] = _build_local_token_for_user(user)
        except Exception:
            pass
        return user

    email = payload.get("email")
    if not email:
        info = fetch_userinfo(token)
        email = info.get("email")

    if not email:
        safe_id = (auth0_id or str(uuid.uuid4())).replace("|", "_")
        email = f"{safe_id}@noemail.local"

    full_name = payload.get("fullName") or payload.get("name")
    if not full_name:
        full_name = "user_" + uuid.uuid4().hex[:8]

    random_pw = str(uuid.uuid4())
    hashed = hash_password(random_pw)

    try:
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
    except Exception:
        user = user_repo.find_by_user_id(auth0_id) or user_repo.find_by_email(email)
        if user:
            try:
                user["access_token"] = _build_local_token_for_user(user)
            except Exception:
                pass
            return user
        raise HTTPException(status_code=500, detail="Unable to create user")

    user = user_repo.find_by_user_id(auth0_id)
    try:
        user["access_token"] = _build_local_token_for_user(user)
    except Exception:
        pass
    return user


def get_current_user(request: Request, db=Depends(get_db_connection)):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = auth_header.split(" ")[1]
    payload = verify_token(token)
    return ensure_user_from_payload(token, payload, db)


def get_current_token(request: Request) -> str:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = auth_header.split(" ")[1]
    return token
