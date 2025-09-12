from fastapi import HTTPException
from datetime import datetime
from typing import List, Dict, Any, Optional
from repositories.inventory_repositories import InventoryRepository
from models.inventory import Product, InventoryResponse


class InventoryService:
    def __init__(self, supabase):
        self.supabase = supabase
        self.inventory_repo = InventoryRepository(supabase)

    def get_inventory(self) -> List[Product]:
        """Obtiene todos los inventories (solo para admin)"""
        return []

    def get_inventory_by_user(self, user_id: str) -> List[Product]:
        """Obtiene el inventory de un usuario específico"""
        return self.inventory_repo.get_inventory_items(user_id)

    def update_stock(
        self,
        product_id: str,
        quantity: int,
        user_id: str,
        user_timezone: str = "UTC",
        reason: Optional[str] = None,
    ):
        """Actualiza el stock de un producto en el inventory del usuario"""
        raise HTTPException(
            status_code=400, detail="Updating stock on inventory.jsonb is not supported"
        )

    def get_inventory_item(self, user_id: str, product_id: str) -> Optional[Product]:
        """Obtiene un item específico del inventory"""
        return self.inventory_repo.get_inventory_item(user_id, product_id)

    def check_low_stock(self, user_id: str, min_threshold: int = 0) -> List[Product]:
        """Obtiene productos con stock bajo para un usuario"""
        return self.inventory_repo.check_low_stock(user_id, min_threshold)

    def get_inventory_summary(self, user_id: str) -> Dict[str, Any]:
        """Obtiene un resumen del inventory de un usuario"""
        return self.inventory_repo.get_inventory_summary(user_id)

    def get_inventory_response(self, user_id: str) -> InventoryResponse:
        """Obtiene la respuesta completa del inventory para la API"""
        items = self.get_inventory_by_user(user_id)
        summary = self.get_inventory_summary(user_id)

        return InventoryResponse(
            success=True,
            inventory={
                "id": None,
                "inventory_owner": user_id,
                "products": [p.dict() if isinstance(p, Product) else p for p in items],
                "created_at": None,
                "last_updated": None,
            },
            total_products=summary.get("total_products", 0),
            total_stock=summary.get("total_stock"),
            low_stock_count=summary.get("low_stock_count"),
        )
