import psycopg2.extras


class BaseRepository:
    def __init__(self, db):
        self.db = db

    def _get_cursor(self):
        """Return a RealDictCursor for PostgreSQL."""
        if getattr(self.db, "closed", 0):
            raise Exception("Database connection is closed")
        return self.db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
