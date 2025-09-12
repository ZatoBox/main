from fastapi import APIRouter, Depends, HTTPException
from services.category_service import CategoryService
from repositories.category_repository import CategoryRepository
from config.supabase import get_supabase_client
from utils.dependencies import get_current_user

router = APIRouter(prefix="/api/categories", tags=["categories"])


def _get_category_service(supabase=Depends(get_supabase_client)) -> CategoryService:
    repo = CategoryRepository(supabase)
    return CategoryService(repo)


@router.get("/")
def list_categories(
    current_user=Depends(get_current_user),
    service: CategoryService = Depends(_get_category_service),
):
    data = service.list_categories()
    return {"success": True, "categories": data}


@router.get("/{category_id}")
def get_category(
    category_id: str,
    current_user=Depends(get_current_user),
    service: CategoryService = Depends(_get_category_service),
):
    try:
        category = service.get_category(category_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"success": True, "category": category}
