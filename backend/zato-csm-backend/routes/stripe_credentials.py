from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from config.supabase import supabase_client
from services.stripe_credentials_service import StripeCredentialsService
from repositories.stripe_credentials_repositories import StripeCredentialsRepository
from utils.dependencies import get_auth_service
from routes.auth import get_current_user_from_token

router = APIRouter(prefix="/api/stripe-credentials", tags=["stripe_credentials"])


class CreateStripeCredentialsPayload(BaseModel):
    stripe_pub_key: str
    stripe_sec_key: str


class UpdateStripeCredentialsPayload(BaseModel):
    stripe_pub_key: Optional[str] = None
    stripe_sec_key: Optional[str] = None


def get_stripe_service():
    repo = StripeCredentialsRepository(supabase_client)
    return StripeCredentialsService(repo)


@router.post("/")
def save_credentials(
    payload: CreateStripeCredentialsPayload,
    service: StripeCredentialsService = Depends(get_stripe_service),
    current_user: dict = Depends(get_current_user_from_token),
):
    try:
        user_id = current_user.id
        return service.save_credentials(
            user_id, payload.stripe_pub_key, payload.stripe_sec_key
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
def get_credentials(
    service: StripeCredentialsService = Depends(get_stripe_service),
    current_user: dict = Depends(get_current_user_from_token),
):
    try:
        user_id = current_user.id
        return service.get_credentials(user_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/")
def update_credentials(
    payload: UpdateStripeCredentialsPayload,
    service: StripeCredentialsService = Depends(get_stripe_service),
    current_user: dict = Depends(get_current_user_from_token),
):
    try:
        user_id = current_user.id
        return service.update_credentials(
            user_id, payload.stripe_pub_key, payload.stripe_sec_key
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/")
def delete_credentials(
    service: StripeCredentialsService = Depends(get_stripe_service),
    current_user: dict = Depends(get_current_user_from_token),
):
    try:
        user_id = current_user.id
        return service.delete_credentials(user_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
