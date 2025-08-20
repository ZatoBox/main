import psycopg2.extras


class BaseRepository:
    def __init__(self, db):
        self.db = db

    def _get_cursor(self):
        """
        Devuelve el cursor para Postgres con RealDictCursor.
        """
        return self.db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
