from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class StripeCredentialsModel(BaseModel):
    id: Optional[str]
    user_id: str
    stripe_pub_key: str
    stripe_sec_key: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
