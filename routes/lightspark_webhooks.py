from fastapi import APIRouter, Request, HTTPException, Depends
from config.database import get_db_connection
from repositories.payments_repository import PaymentsRepository
from services.payments_service import PaymentsService
from services.lightspark_client import get_lightspark_client
from config.lightspark_settings import LIGHTSPARK_WEBHOOK_SECRET

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])

def _get_service(db=Depends(get_db_connection)):
    db_conn = next(db)
    repo = PaymentsRepository(db_conn)
    return PaymentsService(repo)

@router.post("/lightspark")
async def lightspark_webhook(request: Request, svc: PaymentsService = Depends(_get_service)):
    raw_body = await request.body()
    headers = {k.lower(): v for k, v in request.headers.items()}

    client = get_lightspark_client()

    # NOTA: el nombre exacto del helper puede variar por versión del SDK aqui recorda es ajustable
    #aqui9 es donde confirmamos pagos
    try:
        event = client.verify_and_parse_webhook(raw_body, headers, LIGHTSPARK_WEBHOOK_SECRET)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Firma inválida: {e}")

    # Extrae tipo e IDs (ajusta si tu SDK retorna distinto)
    etype = getattr(event, "event_type", None) or event.get("event_type")
    data = getattr(event, "data", None) or event.get("data", {})

    if etype == "PAYMENT_FINISHED":
        payment_id = data.get("entity_id") or data.get("payment_id")
        invoice_id = data.get("invoice_id")  # algunos eventos lo incluyen
        if not invoice_id:
            # Si no viene, consulta a la API por el payment para resolver el invoice asociado.
            payment = client.get_payment(payment_id)
            invoice_id = getattr(payment, "invoice_id", None) or payment.get("invoice_id")
        svc.mark_as_paid(invoice_id=invoice_id, payment_id=payment_id, raw=data)
        return {"ok": True}

    return {"ok": True, "ignored": etype}
