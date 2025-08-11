import json
from repositories.base_repository import BaseRepository

class PaymentsRepository(BaseRepository):
    def create_payment(self, invoice_id: str, amount_msats: int, memo: str|None, order_id: int|None, raw: dict|None):
        if self.db_type == "mysql":
            with self._get_cursor() as c:
                c.execute(
                    "INSERT INTO payments (invoice_id, amount_msats, memo, order_id, status, raw) "
                    "VALUES (%s,%s,%s,%s,'PENDING', CAST(%s AS JSON))",
                    (invoice_id, amount_msats, memo, order_id, json.dumps(raw) if raw else None)
                )
                self.db.commit()
            return self.find_by_invoice(invoice_id)
        else:
            with self._get_cursor() as c:
                c.execute(
                    "INSERT INTO payments (invoice_id, amount_msats, memo, order_id, status, raw) "
                    "VALUES (%s,%s,%s,%s,'PENDING', %s) RETURNING *",
                    (invoice_id, amount_msats, memo, order_id, json.dumps(raw) if raw else None)
                )
                self.db.commit()
                return c.fetchone()

    def mark_paid(self, invoice_id: str, payment_id: str, raw: dict|None):
        if self.db_type == "mysql":
            with self._get_cursor() as c:
                c.execute(
                    "UPDATE payments SET status='PAID', payment_id=%s, raw=CAST(%s AS JSON) WHERE invoice_id=%s",
                    (payment_id, json.dumps(raw) if raw else None, invoice_id)
                )
                self.db.commit()
        else:
            with self._get_cursor() as c:
                c.execute(
                    "UPDATE payments SET status='PAID', payment_id=%s, raw=%s WHERE invoice_id=%s RETURNING *",
                    (payment_id, json.dumps(raw) if raw else None, invoice_id)
                )
                self.db.commit()
                return c.fetchone()

    def find_by_invoice(self, invoice_id: str):
        with self._get_cursor() as c:
            c.execute("SELECT * FROM payments WHERE invoice_id=%s", (invoice_id,))
            return c.fetchone()
