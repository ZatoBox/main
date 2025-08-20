from config.lightspark_settings import LIGHTSPARK_CLIENT_ID, LIGHTSPARK_CLIENT_SECRET
from typing import Optional

_client = None

def get_lightspark_client():
    """
    Envuelve la creación del cliente (singleton) para evitar repetir auth.
    """
    global _client
    if _client is not None:
        return _client

    # Import perezoso para minimizar fallos de import si no está instalada la lib
    try:
        from lightspark import LightsparkClient, AccountTokenAuthProvider
    except Exception as e:
        raise RuntimeError(f"Lightspark SDK no instalado o cambió el namespace: {e}")

    if not LIGHTSPARK_CLIENT_ID or not LIGHTSPARK_CLIENT_SECRET:
        raise RuntimeError("Faltan credenciales LIGHTSPARK_CLIENT_ID/SECRET en .env")

    auth = AccountTokenAuthProvider(LIGHTSPARK_CLIENT_ID, LIGHTSPARK_CLIENT_SECRET)
    _client = LightsparkClient(auth)
    return _client
