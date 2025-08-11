from pydantic import BaseModel, Field
from typing import Optional

class CreateInvoiceIn(BaseModel):
    amount_msats: int = Field(gt=0)
    memo: Optional[str] = None
    order_id: Optional[int] = None
    expiry_secs: int = 600  # 10 minutos

class InvoiceOut(BaseModel):
    invoice_id: str
    encoded_payment_request: str
    amount_msats: int
    memo: Optional[str] = None
    status: str = "PENDING"
