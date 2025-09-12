import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()


def connect_postgres():
    """Create and return a new PostgreSQL connection using separated env vars."""
    user = os.getenv("user")
    password = os.getenv("password")
    host = os.getenv("host")
    port = os.getenv("port")
    dbname = os.getenv("dbname")

    if not all([user, password, host, port, dbname]):
        raise Exception("Missing database environment variables")

    conn_str = (
        f"dbname={dbname} user={user} password={password} host={host} port={port}"
    )
    return psycopg2.connect(conn_str)


def get_db_connection():
    conn = connect_postgres()
    try:
        yield conn
    finally:
        conn.close()
