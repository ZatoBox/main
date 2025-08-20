from fastapi import APIRouter, Depends, Request
from config.database import get_db_connection
from repositories.product_repositories import ProductRepository
from services.inventory_service import InventoryService
from utils.dependencies import get_current_user
from utils.timezone_utils import get_user_timezone_from_request

router = APIRouter(prefix="/api/inventory", tags=["inventory"])


def _get_inventory_service(db=Depends(get_db_connection)) -> InventoryService:
    product_repo = ProductRepository(db)
    return InventoryService(product_repo)


@router.get("")
def get_inventory(
    user=Depends(get_current_user), inventory_service=Depends(_get_inventory_service)
):
    inventory = inventory_service.get_inventory()
    return {"success": True, "inventory": inventory}


@router.get("/user")
def get_user_inventory(
    user=Depends(get_current_user), inventory_service=Depends(_get_inventory_service)
):
    inventory = inventory_service.get_inventory_by_user(user["id"])
    return {"success": True, "inventory": inventory}


@router.put("/{product_id}")
def update_inventory(
    product_id: int,
    quantity: int,
    request: Request,
    user=Depends(get_current_user),
    inventory_service=Depends(_get_inventory_service),
):
    user_timezone = get_user_timezone_from_request(request)
    result = inventory_service.update_stock(product_id, quantity, user_timezone)
    return {
        "success": True,
        "message": "Stock updated successfully",
        "inventory": result,
    }
