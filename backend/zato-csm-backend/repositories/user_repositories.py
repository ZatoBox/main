import psycopg2.extras

from repositories.base_repository import BaseRepository
from utils.timezone_utils import get_current_time_with_timezone


class UserRepository(BaseRepository):
    def find_all_users(self):
        with self._get_cursor() as cursor:
            cursor.execute("SELECT * FROM users")
            return cursor.fetchall()

    def find_by_email(self, email: str):
        with self._get_cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
            return cursor.fetchone()

    def find_by_credentials(self, email: str, password: str):
        with self._get_cursor() as cursor:
            cursor.execute(
                "SELECT id, email, full_name, role, profile_image FROM users WHERE email=%s AND password=%s",
                (email, password),
            )
            return cursor.fetchone()

    def find_by_user_id(self, user_id: str):
        with self._get_cursor() as cursor:
            if not user_id:
                return None
            cursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))
            return cursor.fetchone()

    def create_user(
        self,
        full_name: str,
        email: str,
        password: str,
        phone: str = None,
        role: str = "user",
        user_timezone: str = "UTC",
        profile_image: str = None,
    ):
        created_at = get_current_time_with_timezone(user_timezone)
        last_updated = get_current_time_with_timezone(user_timezone)

        # Only include columns that exist in the database
        columns = [
            "full_name",
            "email",
            "password",
            "phone",
            "role",
            "profile_image",
            "created_at",
            "last_updated",
        ]
        values = [
            full_name,
            email,
            password,
            phone,
            role,
            profile_image,
            created_at,
            last_updated,
        ]

        placeholders = ", ".join(["%s"] * len(columns))
        columns_str = ", ".join(columns)

        with self._get_cursor() as cursor:
            cursor.execute(
                f"INSERT INTO users ({columns_str}) VALUES ({placeholders}) RETURNING id",
                values,
            )
            self.db.commit()
            return cursor.fetchone()["id"]

    def update_profile(self, user_id: str, updates: dict, user_timezone: str = "UTC"):
        # Validation fields - only include fields that exist in the database
        allowed_fields = ["full_name", "phone", "profile_image"]

        # Protecting the created_at and id Update field
        protect_fields = ["email", "created_at", "id"]

        for field in protect_fields:
            updates.pop(field, None)

        updates["last_updated"] = get_current_time_with_timezone(user_timezone)

        # Build dynamic update query
        set_parts = []
        values = []
        for field in allowed_fields:
            if field in updates:
                set_parts.append(f"{field}=%s")
                values.append(updates[field])

        if not set_parts:
            return self.find_by_user_id(user_id)

        set_parts.append("last_updated=%s")
        values.append(updates["last_updated"])
        values.append(user_id)

        query = f"UPDATE users SET {', '.join(set_parts)} WHERE id=%s"

        with self._get_cursor() as cursor:
            cursor.execute(query, values)
            self.db.commit()
            return self.find_by_user_id(user_id)
