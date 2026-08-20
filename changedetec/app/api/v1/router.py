from fastapi import APIRouter
from app.api.v1.endpoints import images, analysis, timeline, reports

api_router = APIRouter()

api_router.include_router(images.router, prefix="/images", tags=["Images"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["Analysis"])
api_router.include_router(timeline.router, prefix="/timeline", tags=["Timeline"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
