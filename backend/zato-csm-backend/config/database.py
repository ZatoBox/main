import contextlib
import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()


def connect_postgres():
    """Create and return a new PostgreSQL connection using a DATABASE_URL env var."""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise Exception("DATABASE_URL environment variable is required")
    return psycopg2.connect(database_url)


@contextlib.contextmanager
def get_db_connection():
    """FastAPI dependency that yields a live PostgreSQL connection for the request lifecycle"""
    conn = connect_postgres()
    try:
        yield conn
    finally:
        conn.close()
