from typing import List, Optional, Dict, Any


class CategoryRepository:
    def __init__(self, supabase):
        self.supabase = supabase
        self.table = "categories"

    def list(self) -> List[Dict[str, Any]]:
        res = self.supabase.table(self.table).select("*").execute()
        data = res.data or []
        return data

    def get(self, category_id: str) -> Optional[Dict[str, Any]]:
        res = (
            self.supabase.table(self.table)
            .select("*")
            .eq("id", category_id)
            .single()
            .execute()
        )
        return res.data
