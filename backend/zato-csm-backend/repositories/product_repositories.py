from fastapi import HTTPException
import json

from repositories.base_repository import BaseRepository

from utils.timezone_utils import get_current_time_with_timezone
from utils.dependencies import get_current_user


class ProductRepository(BaseRepository):

    def create_product(
        self,
        name: str,
        description: str,
        price: float,
        stock: int,
        category: str,
        images: str,
        creator_id: int,
        unit_id: int,
        product_type: str,
        min_stock: int=0,
        sku: str=None,
        status: str="active",
        weight: float=0.0,
        localization: str=None,
        user_timezone: str = "UTC",
    ):
        last_updated = get_current_time_with_timezone(user_timezone)
        created_at = get_current_time_with_timezone(user_timezone)

        images_json = json.dumps(images) if images else json.dumps([])

        with self._get_cursor() as cursor:
            cursor.execute(
                "INSERT INTO products (name, description, price, stock, category, images, status, weigth, sku, creator_id, unit_id, product_type, min_stock, created_at, last_updated, localization) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *",
                (
                    name, description, price, stock, category, images_json,
                    status, weight, sku, creator_id, unit_id, product_type,
                    min_stock, created_at, last_updated, localization
                ),
            )
            self.db.commit()
            return cursor.fetchone()

    def update_product(self, product_id, updates: dict, user_timezone: str = "UTC"):
        # Protecting the created_at and id Update field
        protect_fields = ["created_at", "id"]
        for field in protect_fields:
            updates.pop(field, None)

        updates["last_updated"] = get_current_time_with_timezone(user_timezone)

        # For construction dynamic SQL
        set_clauses = []
        values = []

        for field, value in updates.items():
            set_clauses.append(f"{field}=%s")
            values.append(value)

        values.append(product_id)

        sql = f"UPDATE products SET {','.join(set_clauses)} WHERE id =%s RETURNING *"

        with self._get_cursor() as cursor:
            cursor.execute(sql, values)
            self.db.commit()
            return cursor.fetchone()

    def find_all(self):
        with self._get_cursor() as cursor:
            cursor.execute("SELECT * FROM products")
            return cursor.fetchall()

    def find_by_id(self, product_id: int):
        with self._get_cursor() as cursor:
            cursor.execute("SELECT * FROM products WHERE id=%s", (product_id,))
            return cursor.fetchone()

    def find_by_category(self, category: str):
        with self._get_cursor() as cursor:
            cursor.execute("SELECT * FROM products WHERE category=%s", (category,))
            return cursor.fetchall()

    def find_by_name(self, name: str):
        with self._get_cursor() as cursor:
            cursor.execute("SELECT * FROM products WHERE name=%s", (name,))
            return cursor.fetchall()

    def delete_product(self, product_id: int):
        with self._get_cursor() as cursor:
            cursor.execute(
                "DELETE FROM products WHERE id=%s RETURNING *", (product_id,)
            )
            self.db.commit()
            product = cursor.fetchone()
            if not product:
                raise HTTPException(status_code=404, detail="Product not found")
            return product
