from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, products, inventory, sales, layouts, categories

# Import middleware registry
from middleware.middleware import register_middlewares

app = FastAPI(title="CSM API", description="Headless CSM for Zatobox", version="1.0.0")

# --- Swagger Bearer Token Support ---
from fastapi.openapi.utils import get_openapi


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"}
    }
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method.setdefault("security", []).append({"BearerAuth": []})
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

# CORS config (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://zatobox.io/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_middlewares(app)

# Include routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(inventory.router)
app.include_router(sales.router)
app.include_router(layouts.router)
app.include_router(categories.router)


@app.get("/")
def root():
    return {"message": "CSM API is running", "docs": "/docs"}
