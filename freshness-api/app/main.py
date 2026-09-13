from fastapi import FastAPI
from app.routers import freshness

app = FastAPI(
    title="Freshness AI API",
    description="Fish freshness grading endpoint for Nelayan Marketplace",
    version="1.0.0",
)

app.include_router(freshness.router, prefix="/api/v1")


@app.get("/health")
def health_check():
    return {"status": "ok"}