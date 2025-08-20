from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from config.database import get_db_connection
from repositories.user_repositories import UserRepository
from services.auth_service import AuthService
from utils.dependencies import (
    get_current_token,
    get_current_user,
    verify_token,
    ensure_user_from_payload,
    fetch_userinfo,
)
from datetime import datetime, timedelta
import jwt as pyjwt
import config.settings as settings

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _get_auth_service(db=Depends(get_db_connection)) -> AuthService:
    auth_repo = UserRepository(db)
    return AuthService(auth_repo)


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(payload: LoginRequest, auth_service=Depends(_get_auth_service)):
    result = auth_service.login(payload.email, payload.password)
    return result


class RegisterRequest(BaseModel):
    fullName: str
    email: str
    password: str
    phone: str | None = None
    address: str | None = None


@router.post("/register")
def register(payload: RegisterRequest, auth_service=Depends(_get_auth_service)):
    result = auth_service.register(
        payload.fullName,
        payload.email,
        payload.password,
        payload.phone,
        payload.address,
    )
    return result


@router.post("/logout")
def logout(token: str = Depends(get_current_token)):
    return token


@router.get("/me")
def get_current_user(user=Depends((get_current_user))):
    return user


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


class SocialAuthRequest(BaseModel):
    access_token: str


@router.post("/social")
def social_register(
    payload: SocialAuthRequest,
    db=Depends(get_db_connection),
    auth_service=Depends(_get_auth_service),
):
    try:
        jwt_payload = verify_token(payload.access_token)
    except HTTPException as e:
        if e.status_code == 401:
            info = fetch_userinfo(payload.access_token)
            if not info:
                raise HTTPException(
                    status_code=401, detail="Invalid token or cannot fetch userinfo"
                )
            jwt_payload = {
                "sub": info.get("sub") or info.get("user_id") or info.get("id"),
                "email": info.get("email"),
                "name": info.get("name")
                or info.get("nickname")
                or info.get("given_name"),
            }
        else:
            raise e

    # crea/obtiene usuario y devuelve el mismo formato que login()
    user = ensure_user_from_payload(payload.access_token, jwt_payload, db)
    user_data = dict(user)
    user_data.pop("password", None)
    try:
        token = auth_service.create_access_token({"user_id": user_data["id"]})
    except Exception as ex:
        raise HTTPException(status_code=500, detail="Token generation failed")

    return {"user": user_data, "token": token}


@router.get("/users")
def list_users(
    current_user=Depends(get_current_user), auth_service=Depends(_get_auth_service)
):
    if not current_user.get("admin"):
        raise HTTPException(status_code=403, detail="Acess denied")
    return auth_service.get_list_users()


@router.get("/profile/{user_id}")
def get_profile(
    user_id: int,
    auth_service=Depends(_get_auth_service),
):
    return auth_service.get_profile_user(user_id)


@router.put("/profile/{user_id}")
def update_profile(
    user_id: int,
    updates: dict = Body(...),
    current_user=Depends(get_current_user),
    auth_service=Depends(_get_auth_service),
):
    if not current_user.get("admin"):
        raise HTTPException(status_code=403, detail="Acess denied")
    return auth_service.update_profile(user_id, updates)


@router.get("/check-email")
def check_email(email: str, db=Depends(get_db_connection)):
    with db.cursor() as cursor:
        cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
        row = cursor.fetchone()
    return {"exists": bool(row)}
