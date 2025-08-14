from repositories.base_repository import BaseRepository
from utils.timezone_utils import get_current_time_with_timezone


class SalesRepository(BaseRepository):
    def create_sale(
        self,
        items: str,
        total: float,
        payment_method: str,
        user_id: int,
        status: str = "completed",
        user_timezone: str = "UTC",
    ):
        created_at = get_current_time_with_timezone(user_timezone)

        with self._get_cursor() as cursor:
            cursor.execute(
                "INSERT INTO sales (items, total, payment_method, user_id, status, created_at) "
                "VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                (items, total, payment_method, user_id, status, created_at),
            )
            self.db.commit()
            return cursor.fetchone()["id"]

    def find_by_id(self, sale_id: int):
        with self._get_cursor() as cursor:
            cursor.execute("SELECT * FROM sales WHERE id=%s", (sale_id,))
            return cursor.fetchone()

    def list_sales(self):
        with self._get_cursor() as cursor:
            cursor.execute("SELECT * FROM sales")
            return cursor.fetchall()
