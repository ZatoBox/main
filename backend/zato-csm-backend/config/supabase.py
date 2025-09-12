from supabase import create_client, Client
import os
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise RuntimeError(
        "Supabase URL and SERVICE KEY must be set in environment variables"
    )

supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def get_supabase_client() -> Client:
    return supabase_client
