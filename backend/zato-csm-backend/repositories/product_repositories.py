from fastapi import HTTPException
import json

from repositories.base_repository import BaseRepository

from utils.timezone_utils import get_current_time_with_timezone


class ProductRepository(BaseRepository):

    def create_product(
        self,
        name: str,
        description: str | None,
        price: float,
        stock: int,
        unit: str,
        product_type: str,
        category: str,
        sku: str | None,
        min_stock: int,
        status: str,
        weight: float | None,
        localization: str | None,
        creator_id: int,
    ):
        query = """
        INSERT INTO products
            (name, description, price, stock, min_stock, category, images, status, weight, sku, creator_id, unit, product_type, localization)
        VALUES
            (%s, %s, %s, %s, %s, %s, '[]'::jsonb, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id, name, description, price, stock, min_stock, category, images, status, weight, sku, creator_id, unit, product_type, created_at, last_updated, localization
        """
        cur = self.db.cursor()
        cur.execute(
            query,
            (
                name,
                description,
                price,
                stock,
                min_stock,
                category,
                status,
                weight,
                sku,
                creator_id,
                unit,
                product_type,
                localization,
            ),
        )
        row = cur.fetchone()
        self.db.commit()
        colnames = [desc[0] for desc in cur.description]
        cur.close()
        return dict(zip(colnames, row))

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

    def find_by_category(self, category_id: int):
        with self._get_cursor() as cursor:
            cursor.execute(
                "SELECT * FROM products WHERE category_id=%s", (category_id,)
            )
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
