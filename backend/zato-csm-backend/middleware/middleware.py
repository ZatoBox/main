from typing import Callable, Optional
import time
import uuid
import logging
import traceback

from starlette.requests import Request
from starlette.responses import JSONResponse, Response
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import FastAPI, status, HTTPException
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("zato.middleware")
logger.setLevel(logging.INFO)


class RequestIDMiddleware(BaseHTTPMiddleware):
    """Add a unique request id to each request (X-Request-ID)."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        req_id = str(uuid.uuid4())
        request.state.request_id = req_id
        response = await call_next(request)
        # expose header for tracing
        response.headers["X-Request-ID"] = req_id
        return response


class LoggingMiddleware(BaseHTTPMiddleware):
    """Log request start/end with duration and status."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start = time.time()
        method = request.method
        path = request.url.path
        req_id = getattr(request.state, "request_id", None) or "-"
        logger.info(f"[{req_id}] → {method} {path}")
        try:
            response = await call_next(request)
        except Exception:
            # let exception middleware handle it but log here too
            logger.exception(f"[{req_id}] exception while handling {method} {path}")
            raise
        elapsed = (time.time() - start) * 1000.0
        logger.info(
            f"[{req_id}] ← {method} {path} {response.status_code} {elapsed:.1f}ms"
        )
        return response


class ExceptionMiddleware(BaseHTTPMiddleware):
    """Catch unhandled exceptions, log stacktrace and return safe JSON error."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        req_id = getattr(request.state, "request_id", None) or "-"
        try:
            return await call_next(request)
        except Exception as exc:
            # log full trace
            trace = traceback.format_exc()
            logger.error(f"[{req_id}] Unhandled exception: {exc}\n{trace}")

            # If client expects JSON (API call or openapi.json) return JSON error.
            # Otherwise re-raise so FastAPI can serve static files / UI assets correctly.
            accept = request.headers.get("accept", "").lower()
            is_openapi = request.url.path.startswith("/openapi.json")
            if is_openapi or "application/json" in accept:
                payload = {
                    "error": "internal_server_error",
                    "message": "An unexpected error occurred.",
                    "request_id": req_id,
                }
                return JSONResponse(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=payload
                )

            raise


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add common security headers to responses."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)

        path = request.url.path or ""
        if not (
            path.startswith("/docs")
            or path.startswith("/openapi.json")
            or path.startswith("/redoc")
            or path.startswith("/static")
        ):
            # Minimal, recommended headers
            response.headers.setdefault("Content-Security-Policy", "default-src 'self'")
        # Other safe headers applied for all paths
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("Referrer-Policy", "no-referrer")
        response.headers.setdefault("Permissions-Policy", "geolocation=()")
        return response


class AuthAttachMiddleware(BaseHTTPMiddleware):
    """
    Extract Bearer token and optionally validate it via provided validator.
    If validator is provided, it should be: async def validate(token:str, request:Request) -> Optional[dict]
    and return a user-like dict or raise/return None.
    """

    def __init__(self, app, auth_validator: Optional[Callable] = None):
        super().__init__(app)
        self.auth_validator = auth_validator

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        auth = request.headers.get("Authorization", "")
        token = None
        if auth.lower().startswith("bearer "):
            token = auth.split(" ", 1)[1].strip()
        request.state.auth_token = token
        request.state.current_user = None

        if token and self.auth_validator:
            try:
                # allow validator to attach/return user object
                user = await self.auth_validator(token, request)
                request.state.current_user = user
            except Exception as e:
                # Do not block request here; let route/dependency handle auth decisions.
                logger.warning(
                    f"[{getattr(request.state, 'request_id', '-')}] token validation error: {e}"
                )

        return await call_next(request)


def register_middlewares(
    app: FastAPI, auth_validator: Optional[Callable] = None
) -> None:
    """Register all middlewares in recommended order."""
    # exception first to catch errors from later middlewares/routes
    app.add_middleware(ExceptionMiddleware)
    # assign request id early
    app.add_middleware(RequestIDMiddleware)
    # attach token / optional user
    app.add_middleware(AuthAttachMiddleware, auth_validator=auth_validator)
    # logging after request id & auth
    app.add_middleware(LoggingMiddleware)
    # final response hardening
    app.add_middleware(SecurityHeadersMiddleware)
