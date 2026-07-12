from fastapi import FastAPI

from app.api.v1.health import router as health_router
from app.api.v1.upload import router as upload_router
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version,
)


@app.get("/", tags=["Home"])
def root():
    return {
        "message": f"Welcome to {settings.app_name}",
        "version": settings.app_version,
        "environment": settings.environment,
    }


app.include_router(
    health_router,
    prefix="/api/v1",
)

app.include_router(
    upload_router,
    prefix="/api/v1",
)