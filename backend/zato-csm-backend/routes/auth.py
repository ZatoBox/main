from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional
from config.supabase import supabase_client
from supabase import AuthError as SupabaseAuthError
from datetime import datetime
from services.auth_service import AuthService
from utils.dependencies import get_auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


def get_current_user_from_token(token: str = Depends(oauth2_scheme)):
    """Verify the JWT token and return the current user."""
    try:
        user_response = supabase_client.auth.get_user(token)
        return user_response.user
    except SupabaseAuthError as e:
        raise HTTPException(
            status_code=401,
            detail="Credenciales de autenticación inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_admin_user(current_user: dict = Depends(get_current_user_from_token)):
    """Verify if the authenticated user has the 'admin' role."""
    try:
        user_profile = (
            supabase_client.from_("users")
            .select("role")
            .eq("id", current_user.id)
            .single()
            .execute()
            .data
        )
        if user_profile and user_profile.get("role") == "admin":
            return current_user

        raise HTTPException(
            status_code=403, detail="No tienes permisos de administrador"
        )
    except Exception as e:
        raise HTTPException(
            status_code=403, detail="No tienes permisos de administrador"
        )


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    phone: Optional[str] = None


class UserInfo(BaseModel):
    id: str
    email: str
    full_name: str
    phone: Optional[str]
    address: Optional[str]
    role: str
    created_at: datetime
    last_updated: datetime


# --- Auth Routes ---


@router.post("/login")
def login(payload: LoginRequest):
    """Allows an existing user to log in."""
    try:
        response = supabase_client.auth.sign_in_with_password(
            {"email": payload.email, "password": payload.password}
        )
        return {
            "user": response.user.model_dump(),
            "token": response.session.access_token,
        }
    except SupabaseAuthError as e:
        raise HTTPException(status_code=401, detail=e.message)


@router.post("/register")
def register(payload: RegisterRequest):
    """Creates a new user with email and password."""
    try:
        response = supabase_client.auth.sign_up(
            {
                "email": payload.email,
                "password": payload.password,
                "options": {
                    "data": {
                        "full_name": payload.full_name,
                        "phone": payload.phone,
                    }
                },
            }
        )
        return {
            "user": response.user.model_dump(),
            "token": response.session.access_token,
        }
    except SupabaseAuthError as e:
        error_detail = "Error de autenticación desconocido"
        try:
            if hasattr(e, "json") and e.json().get("msg"):
                error_detail = e.json()["msg"]
            elif hasattr(e, "message"):
                error_detail = e.message
        except:
            pass

        try:
            status_code = int(e.code)
        except (ValueError, TypeError):
            status_code = 400

        raise HTTPException(status_code=status_code, detail=error_detail)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Registration failed")


# --- Protected Routes ---


@router.get("/me")
def get_current_user_profile(current_user: dict = Depends(get_current_user_from_token)):
    """Gets the profile of the currently authenticated user. RLS policies protect it."""
    try:
        response = (
            supabase_client.from_("users")
            .select("*")
            .eq("id", current_user.id)
            .single()
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404, detail="Perfil de usuario no encontrado"
            )

        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/users/{user_id}")
def get_user_by_id(
    user_id: str, current_user: dict = Depends(get_current_user_from_token)
):
    """Gets the profile of a specific user. RLS policies protect it."""
    try:
        response = (
            supabase_client.from_("users").select("*").eq("id", user_id).execute()
        )

        if not response.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/users")
def list_all_users(current_user: dict = Depends(get_current_admin_user)):
    """Gets a list of all users. Requires admin permissions."""
    try:
        response = supabase_client.from_("users").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload-profile-image")
def upload_profile_image(
    file: UploadFile = File(...),
    auth_service: AuthService = Depends(get_auth_service),
    current_user: dict = Depends(get_current_user_from_token),
):
    """Uploads a profile image for the current user."""
    try:
        user_id = current_user.id
        result = auth_service.upload_profile_image(user_id, file)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/delete-profile-image")
def delete_profile_image(
    auth_service: AuthService = Depends(get_auth_service),
    current_user: dict = Depends(get_current_user_from_token),
):
    """Deletes the profile image for the current user."""
    try:
        user_id = current_user.id
        result = auth_service.delete_profile_image(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/update-profile-image")
def update_profile_image(
    file: UploadFile = File(...),
    auth_service: AuthService = Depends(get_auth_service),
    current_user: dict = Depends(get_current_user_from_token),
):
    """Updates/replaces the profile image for the current user."""
    try:
        user_id = current_user.id
        result = auth_service.update_profile_image(user_id, file)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
