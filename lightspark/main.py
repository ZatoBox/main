from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from lightspark.routes import auth, products, inventory
from lightspark.routes import payments as payments_routes, lightspark_webhooks


app = FastAPI(title="CSM API", description="Headless CSM for Zatobox", version="1.0.0")

# CORS config (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(inventory.router)
app.include_router(payments_routes.router)
app.include_router(lightspark_webhooks.router)


@app.get("/")
def root():
    return {"message": "CSM API is running", "docs": "/docs"}
