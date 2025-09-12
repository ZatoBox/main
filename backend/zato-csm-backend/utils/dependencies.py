from fastapi import HTTPException, Depends, Request
from config.database import get_db_connection
from repositories.user_repositories import UserRepository
from services.auth_service import AuthService
from utils.password_utils import hash_password
import jwt as pyjwt
import uuid
import config.settings as settings
from datetime import datetime, timedelta
import os


def verify_token(token: str):
    try:
        secret = getattr(settings, "SECRET_KEY", None)
        alg = getattr(settings, "ALGORITHM", "HS256")
        if secret:
            payload = pyjwt.decode(token, secret, algorithms=[alg])
            return payload
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        pass

    supabase_service_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")
    for supa_key in [supabase_service_key, supabase_anon_key]:
        if not supa_key:
            continue
        try:
            payload = pyjwt.decode(
                token, supa_key, algorithms=["HS256"], options={"verify_aud": False}
            )
            return payload
        except pyjwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except pyjwt.InvalidTokenError:
            continue

    try:
        unverified = pyjwt.decode(
            token,
            options={
                "verify_signature": False,
                "verify_aud": False,
                "verify_exp": False,
            },
            algorithms=["HS256", "RS256"],
        )
        if "sub" not in unverified:
            unverified["sub"] = (
                unverified.get("user_id") or unverified.get("email") or uuid.uuid4().hex
            )
        return unverified
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


def _build_local_token_for_user(user: dict) -> str:
    secret = getattr(settings, "SECRET_KEY", "zatobox")
    alg = getattr(settings, "ALGORITHM", "HS256")
    exp_minutes = int(getattr(settings, "ACCESS_TOKEN_EXPIRE_MINUTES", 60))
    payload = {
        "sub": str(user.get("id")),
        "user_id": user.get("id"),
        "email": user.get("email"),
        "exp": datetime.utcnow() + timedelta(minutes=exp_minutes),
    }
    token = pyjwt.encode(payload, secret, algorithm=alg)
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token


def ensure_user_from_payload(token: str, payload: dict, db):
    user_repo = UserRepository(db)
    email = payload.get("email")
    user_id_claim = payload.get("user_id") or payload.get("sub")
    user = None
    if user_id_claim:
        user = user_repo.find_by_user_id(user_id_claim)
    if not user and email:
        user = user_repo.find_by_email(email)
    if user:
        try:
            user["access_token"] = _build_local_token_for_user(user)
        except Exception:
            pass
        return user

    if not email:
        safe_id = (user_id_claim or str(uuid.uuid4())).replace("|", "_")
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
        )
    except Exception:
        user = user_repo.find_by_user_id(user_id_claim) or user_repo.find_by_email(
            email
        )
        if user:
            try:
                user["access_token"] = _build_local_token_for_user(user)
            except Exception:
                pass
            return user
        raise HTTPException(status_code=500, detail="Unable to create user")

    user = user_repo.find_by_user_id(new_id)
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


def get_auth_service(db=Depends(get_db_connection)):
    user_repo = UserRepository(db)
    return AuthService(user_repo)
