import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

ENVIRONMENT = os.getenv("ENVIRONMENT")

# Support a comma-separated list in env or fallback to single ALGORITHM
_algorithms_env = os.getenv("ALGORITHMS", "")
if _algorithms_env:
    ALGORITHMS = [s.strip() for s in _algorithms_env.split(",") if s.strip()]
else:
    ALGORITHMS = [ALGORITHM]
