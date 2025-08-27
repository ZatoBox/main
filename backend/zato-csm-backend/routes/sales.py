from typing import List
from fastapi import APIRouter, Depends
from models.sales import SaleResponse, CreateSaleRequest
from services.sales_service import SalesService
from utils.dependencies import get_current_user
from repositories.sales_repositories import SalesRepository
from config.supabase import get_supabase_client

router = APIRouter(prefix="/api/sales", tags=["sales"])


def _get_sale_service(supabase=Depends(get_supabase_client)) -> SalesService:
    sales_repo = SalesRepository(supabase)
    return SalesService(sales_repo)


@router.post("/", response_model=SaleResponse)
def create_sale(
    sale_data: CreateSaleRequest,
    current_user=Depends(get_current_user),
    sales_service: SalesService = Depends(_get_sale_service),
):
    return sales_service.create_sale(sale_data, current_user)


@router.get("/{sale_id}", response_model=SaleResponse)
def get_sale(sale_id: str, sales_service: SalesService = Depends(_get_sale_service)):
    return sales_service.get_sale(sale_id)


@router.get("/", response_model=List[SaleResponse])
def get_sales_history(sales_service: SalesService = Depends(_get_sale_service)):
    return sales_service.history_sales()
