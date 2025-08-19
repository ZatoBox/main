import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

DATABASE_TYPE = os.getenv("DATABASE_TYPE", "postgres")

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Auth0 / OIDC settings
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN", "")
AUTH0_AUDIENCE = os.getenv("AUTH0_AUDIENCE", "")
# Optional explicit issuer (falls back to https://{AUTH0_DOMAIN}/ when AUTH0_DOMAIN set)
AUTH0_ISSUER = os.getenv(
    "AUTH0_ISSUER", f"https://{AUTH0_DOMAIN}/" if AUTH0_DOMAIN else ""
)

# Support a comma-separated list in env or fallback to single ALGORITHM
_algorithms_env = os.getenv("ALGORITHMS", "")
if _algorithms_env:
    ALGORITHMS = [s.strip() for s in _algorithms_env.split(",") if s.strip()]
else:
    ALGORITHMS = [ALGORITHM]
