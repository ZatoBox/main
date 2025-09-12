from typing import List, Dict, Any
from repositories.category_repository import CategoryRepository


class CategoryService:
    def __init__(self, repo: CategoryRepository):
        self.repo = repo

    def list_categories(self) -> List[Dict[str, Any]]:
        return self.repo.list()

    def get_category(self, category_id: str) -> Dict[str, Any]:
        category = self.repo.get(category_id)
        if not category:
            raise ValueError("Category not found")
        return category
