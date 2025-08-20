import contextlib
import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()

# PostgreSQL connections config
POSTGRES_CONFIG = {
    "host": os.getenv("POSTGRES_HOST", "localhost"),
    "user": os.getenv("POSTGRES_USER", "postgres"),
    "password": os.getenv("POSTGRES_PASSWORD"),
    "database": os.getenv("POSTGRES_DATABASE", "zatobox_csm_db"),
    "port": int(os.getenv("POSTGRES_PORT", "5432")),
}


def connect_postgres():
    """Create and return a new PostgreSQL connection."""
    if not POSTGRES_CONFIG["password"]:
        raise Exception("POSTGRES_PASSWORD enviroment variable is required")
    return psycopg2.connect(**POSTGRES_CONFIG)


def get_db_connection():
    """FastAPI dependency that yields a live PostgreSQL connection for the request lifecycle."""
    conn = connect_postgres()
    try:
        yield conn
    finally:
        conn.close()
