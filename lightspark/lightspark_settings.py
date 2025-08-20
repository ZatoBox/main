import os
from dotenv import load_dotenv
load_dotenv()

LIGHTSPARK_CLIENT_ID = os.getenv("LIGHTSPARK_API_TOKEN_CLIENT_ID", "")
LIGHTSPARK_CLIENT_SECRET = os.getenv("LIGHTSPARK_API_TOKEN_CLIENT_SECRET", "")
LIGHTSPARK_WEBHOOK_SECRET = os.getenv("LIGHTSPARK_WEBHOOK_SECRET", "")
LIGHTSPARK_TEST_MODE = os.getenv("LIGHTSPARK_TEST_MODE", "true").lower() == "true"
