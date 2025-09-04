from fastapi import HTTPException
from supabase import Client
from typing import List, Dict, Any, Optional
from models.inventory import Inventory, Product
from utils.timezone_utils import get_current_time_with_timezone


class InventoryRepository:
    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.table = "inventory"

    def get_inventory_by_owner(self, owner_id: str) -> Optional[Inventory]:
        """Obtiene el inventory completo de un usuario"""
        resp = (
            self.supabase.table(self.table)
            .select("*")
            .eq("inventory_owner", owner_id)
            .execute()
        )
        data = None
        if resp and getattr(resp, "data", None):
            data = (
                resp.data[0]
                if isinstance(resp.data, list) and len(resp.data) > 0
                else resp.data
            )

        if not data:
            return None

        products = data.get("products") or []
        if isinstance(products, dict):
            try:
                products = list(products.values())
            except Exception:
                products = []

        data["products"] = products

        return Inventory(**data)

    def create_inventory(self, owner_id: str) -> Inventory:
        """Crea un nuevo inventory vacío para un usuario"""
        payload = {"inventory_owner": owner_id, "products": []}
        resp = self.supabase.table(self.table).insert(payload).execute()
        data = getattr(resp, "data", None)
        if not data:
            raise HTTPException(status_code=400, detail="Error creating inventory")
        return Inventory(**data[0])

    def get_or_create_inventory(self, owner_id: str) -> Inventory:
        """Obtiene el inventory de un usuario o lo crea si no existe"""
        inventory = self.get_inventory_by_owner(owner_id)
        if not inventory:
            inventory = self.create_inventory(owner_id)
        return inventory

    def get_inventory_items(self, owner_id: str) -> List[Product]:
        """Obtiene todos los items del inventory como lista"""
        inventory = self.get_inventory_by_owner(owner_id)
        if not inventory or not inventory.products:
            return []

        return inventory.products

    def get_inventory_item(self, owner_id: str, product_id: str) -> Optional[Product]:
        """Obtiene un item específico del inventory"""
        inventory = self.get_inventory_by_owner(owner_id)
        if not inventory or not inventory.products:
            return None

        for p in inventory.products:
            # p may be a dict or Product model
            pid = p.get("id") if isinstance(p, dict) else getattr(p, "id", None)
            if str(pid) == str(product_id):
                return Product(**(p if isinstance(p, dict) else p.dict()))

        return None

    def update_inventory_item(
        self, owner_id: str, product_id: str, updates: Dict[str, Any]
    ) -> Product:
        """Actualiza un item específico en el inventory usando JSONB operations"""
        inventory = self.get_or_create_inventory(owner_id)
        products = inventory.products or []
        found = None
        for idx, p in enumerate(products):
            pid = p.get("id") if isinstance(p, dict) else getattr(p, "id", None)
            if str(pid) == str(product_id):
                found = (idx, p)
                break

        if not found:
            product_resp = (
                self.supabase.table("products")
                .select("id,name,status")
                .eq("id", product_id)
                .single()
                .execute()
            )
            product_data = getattr(product_resp, "data", None)
            if not product_data:
                raise HTTPException(status_code=404, detail="Product not found")

            new_product = {
                "id": product_data.get("id"),
                "name": product_data.get("name"),
                "status": product_data.get("status", "active"),
            }
            products.append(new_product)
            current_product = new_product
        else:
            idx, existing = found
            current_product = (
                existing if isinstance(existing, dict) else existing.dict()
            )
            for key, value in updates.items():
                if key in ("name", "status"):
                    current_product[key] = value
            products[idx] = current_product

        serializable = [p if isinstance(p, dict) else p.dict() for p in products]

        resp = (
            self.supabase.table(self.table)
            .update({"products": serializable})
            .eq("inventory_owner", owner_id)
            .execute()
        )

        data = getattr(resp, "data", None)
        if not data:
            raise HTTPException(status_code=400, detail="Error updating inventory")

        return Product(**current_product)

    def remove_inventory_item(self, owner_id: str, product_id: str) -> bool:
        """Remueve un item del inventory"""
        inventory = self.get_inventory_by_owner(owner_id)
        if not inventory or not inventory.products:
            return False

        products = inventory.products
        new_products = [
            p
            for p in products
            if str(p.get("id") if isinstance(p, dict) else getattr(p, "id", None))
            != str(product_id)
        ]

        resp = (
            self.supabase.table(self.table)
            .update({"products": new_products})
            .eq("inventory_owner", owner_id)
            .execute()
        )

        data = getattr(resp, "data", None)
        return data is not None

    def get_inventory_summary(self, owner_id: str) -> Dict[str, Any]:
        """Obtiene un resumen del inventory"""
        items = self.get_inventory_items(owner_id)
        total_products = len(items)
        return {
            "total_products": total_products,
            "total_stock": None,
            "low_stock_count": None,
        }

    def check_low_stock(self, owner_id: str, threshold: int = 0) -> List[Product]:
        """Ya no aplica: el esquema actual no contiene stock en el inventory.jsonb"""
        return []
