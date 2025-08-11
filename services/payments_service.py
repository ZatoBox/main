import os
from models.payments_models import CreateInvoiceIn, InvoiceOut
from repositories.payments_repository import PaymentsRepository
from services.lightspark_client import get_lightspark_client
from config.lightspark_settings import LIGHTSPARK_TEST_MODE

class PaymentsService:
    def __init__(self, repo: PaymentsRepository):
        self.repo = repo
        self.client = get_lightspark_client()

    def create_invoice(self, data: CreateInvoiceIn) -> InvoiceOut:
        # en productivo usamos el de invoice real con expiry.
        if LIGHTSPARK_TEST_MODE:
            invoice = self.client.create_test_mode_invoice(
                amount_msats=data.amount_msats,
                memo=data.memo or "Zatobox invoice"
            )
        else:
            invoice = self.client.create_invoice(
                amount_msats=data.amount_msats,
                memo=data.memo or "Zatobox invoice",
                expiry_secs=data.expiry_secs
            )

        # Los nombres de atributos pueden variar por versión del SDK:
        inv_id = getattr(invoice, "id", None) or invoice.get("id")
        pr = getattr(invoice, "encoded_payment_request", None) or invoice.get("encoded_payment_request")

        self.repo.create_payment(
            invoice_id=inv_id,
            amount_msats=data.amount_msats,
            memo=data.memo,
            order_id=data.order_id,
            raw=invoice.__dict__ if hasattr(invoice, "__dict__") else dict(invoice)
        )

        return InvoiceOut(
            invoice_id=inv_id,
            encoded_payment_request=pr,
            amount_msats=data.amount_msats,
            memo=data.memo,
            status="PENDING"
        )

    def mark_as_paid(self, invoice_id: str, payment_id: str, raw: dict|None):
        return self.repo.mark_paid(invoice_id, payment_id, raw)
