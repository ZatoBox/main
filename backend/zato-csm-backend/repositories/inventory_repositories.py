from fastapi import HTTPException
from supabase import Client
from typing import List, Dict, Any, Optional
from models.inventory import Inventory, InventoryItem
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
            .single()
            .execute()
        )
        data = getattr(resp, "data", None)
        if not data:
            return None
        return Inventory(**data)

    def create_inventory(self, owner_id: str) -> Inventory:
        """Crea un nuevo inventory vacío para un usuario"""
        payload = {"inventory_owner": owner_id, "products": {}}
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

    def get_inventory_items(self, owner_id: str) -> List[InventoryItem]:
        """Obtiene todos los items del inventory como lista"""
        inventory = self.get_inventory_by_owner(owner_id)
        if not inventory or not inventory.products:
            return []

        return list(inventory.products.values())

    def get_inventory_item(
        self, owner_id: str, product_id: str
    ) -> Optional[InventoryItem]:
        """Obtiene un item específico del inventory"""
        inventory = self.get_inventory_by_owner(owner_id)
        if not inventory or not inventory.products:
            return None

        return inventory.products.get(product_id)

    def update_inventory_item(
        self, owner_id: str, product_id: str, updates: Dict[str, Any]
    ) -> InventoryItem:
        """Actualiza un item específico en el inventory usando JSONB operations"""
        # Primero obtenemos el inventory actual
        inventory = self.get_or_create_inventory(owner_id)

        # Si el producto no existe en el inventory, lo agregamos
        if product_id not in inventory.products:
            # Obtenemos los datos del producto de la tabla products
            product_resp = (
                self.supabase.table("products")
                .select("*")
                .eq("id", int(product_id))
                .single()
                .execute()
            )
            product_data = getattr(product_resp, "data", None)
            if not product_data:
                raise HTTPException(status_code=404, detail="Product not found")

            # Convertimos a InventoryItem
            inventory_item = InventoryItem(**product_data)
            inventory.products[product_id] = inventory_item

        # Aplicamos las actualizaciones
        current_item = inventory.products[product_id]
        for key, value in updates.items():
            if hasattr(current_item, key):
                setattr(current_item, key, value)

        # Actualizamos el inventory en la base de datos
        new_products = inventory.products.copy()
        new_products[product_id] = current_item

        resp = (
            self.supabase.table(self.table)
            .update({"products": new_products})
            .eq("inventory_owner", owner_id)
            .execute()
        )

        data = getattr(resp, "data", None)
        if not data:
            raise HTTPException(status_code=400, detail="Error updating inventory")

        return current_item

    def remove_inventory_item(self, owner_id: str, product_id: str) -> bool:
        """Remueve un item del inventory"""
        # Obtenemos el inventory actual
        inventory = self.get_inventory_by_owner(owner_id)
        if not inventory or product_id not in inventory.products:
            return False

        # Removemos el producto del diccionario
        new_products = inventory.products.copy()
        del new_products[product_id]

        # Actualizamos la base de datos
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
        total_stock = sum(item.stock for item in items)
        low_stock_count = len([item for item in items if item.stock <= item.min_stock])

        return {
            "total_products": total_products,
            "total_stock": total_stock,
            "low_stock_count": low_stock_count,
        }

    def check_low_stock(self, owner_id: str, threshold: int = 0) -> List[InventoryItem]:
        """Obtiene productos con stock bajo"""
        items = self.get_inventory_items(owner_id)
        return [item for item in items if item.stock <= threshold]
