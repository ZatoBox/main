from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from config.supabase import supabase_client
from supabase import AuthError as SupabaseAuthError
from datetime import datetime

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    phone: Optional[str] = None
    address: Optional[str] = None


class UserInfo(BaseModel):
    id: str
    email: str
    full_name: str
    phone: Optional[str]
    address: Optional[str]
    role: str
    created_at: datetime
    last_updated: datetime


@router.post("/login")
def login(payload: LoginRequest):
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


# En tu archivo routes/auth.py


@router.post("/register")
def register(payload: RegisterRequest):
    try:
        response = supabase_client.auth.sign_up(
            {
                "email": payload.email,
                "password": payload.password,
                "options": {
                    "data": {
                        "full_name": payload.full_name,
                        "phone": payload.phone,
                        "address": payload.address,
                    }
                },
            }
        )
        return {
            "user": response.user.model_dump(),
            "token": response.session.access_token,
        }
    except SupabaseAuthError as e:
        # Intenta obtener el mensaje de error del JSON de respuesta de Supabase
        error_detail = "Error de autenticación desconocido"
        try:
            # Algunas veces el mensaje está en e.json().msg
            if hasattr(e, "json") and e.json().get("msg"):
                error_detail = e.json()["msg"]
            # Otras veces el error está en e.message (como antes)
            elif hasattr(e, "message"):
                error_detail = e.message
        except:
            # Si nada funciona, dejamos el mensaje por defecto
            pass

        # Intenta convertir a int, si falla usa 400 por defecto
        try:
            status_code = int(e.code)
        except (ValueError, TypeError):
            status_code = 400

        raise HTTPException(status_code=status_code, detail=error_detail)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Registration failed")


@router.get("/users")
def list_users():
    try:
        response = supabase_client.from_("users").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/profile/{user_id}")
def get_profile(user_id: str):
    try:
        response = (
            supabase_client.from_("users").select("*").eq("auth_id", user_id).execute()
        )
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
