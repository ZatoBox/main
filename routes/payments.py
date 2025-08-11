from fastapi import APIRouter, Depends, Body
from config.database import get_db_connection
from repositories.payments_repository import PaymentsRepository
from services.payments_service import PaymentsService
from models.payments_models import CreateInvoiceIn
from utils.dependencies import get_current_user

router = APIRouter(prefix="/api/payments", tags=["payments"])

def _get_service(db=Depends(get_db_connection)):
    db_conn = next(db)                # <- importante: extraer la conexión
    repo = PaymentsRepository(db_conn)
    return PaymentsService(repo)

@router.post("/invoices")
def create_invoice(payload: CreateInvoiceIn = Body(...),
                   user = Depends(get_current_user),
                   svc: PaymentsService = Depends(_get_service)):
    out = svc.create_invoice(payload)
    return {"success": True, "invoice": out.model_dump()}
