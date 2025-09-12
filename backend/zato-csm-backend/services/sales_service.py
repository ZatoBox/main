from fastapi import HTTPException
from models.sales import CreateSaleRequest, SaleResponse, SalesItem
from repositories.sales_repositories import SalesRepository


class SalesService:
    def __init__(self, sales_repo: SalesRepository):
        self.sales_repo = sales_repo

    def create_sale(self, sale_data: CreateSaleRequest, user: dict) -> SaleResponse:
        creator_id = user.get("id")
        if not creator_id:
            raise HTTPException(status_code=401, detail="User not found")
        items_list = [item.dict() for item in sale_data.items]
        sale = self.sales_repo.create_sale(
            items=items_list,
            payment_method=sale_data.payment_method.value,
            creator_id=str(creator_id),
            status=sale_data.status.value,
        )
        if not sale:
            raise HTTPException(status_code=500, detail="Failed to create sale")
        sale["items"] = [SalesItem(**it) for it in sale.get("items", [])]
        return SaleResponse(**sale)

    def history_sales(self):
        sales = self.sales_repo.list_sales()
        results = []
        for sale in sales:
            sale["items"] = [SalesItem(**it) for it in sale.get("items", [])]
            results.append(SaleResponse(**sale))
        return results

    def get_sale(self, sale_id: str):
        sale = self.sales_repo.find_by_id(sale_id)
        if not sale:
            raise HTTPException(status_code=404, detail="Sale not found")
        sale["items"] = [SalesItem(**it) for it in sale.get("items", [])]
        return SaleResponse(**sale)
