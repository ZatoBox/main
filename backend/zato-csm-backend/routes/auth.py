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


class SocialAuthRequest(BaseModel):
    access_token: str


@router.post("/social")
def social_register(payload: SocialAuthRequest, db=Depends(get_db_connection)):
    try:
        jwt_payload = verify_token(payload.access_token)
        user = ensure_user_from_payload(payload.access_token, jwt_payload, db)
        return {"success": True, "user": user}
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
            user = ensure_user_from_payload(payload.access_token, jwt_payload, db)
            return {"success": True, "user": user}
        raise e


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
    # current_user=Depends(get_current_user),
    auth_service=Depends(_get_auth_service),
):
    # Thinking..
    # if user_id != current_user.get('user_id') and not current_user.get('is_admin'):
    #     raise HTTPException(status_code=403, detail="Access denied")
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
