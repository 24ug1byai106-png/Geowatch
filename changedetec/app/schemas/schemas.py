from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any
import datetime
from uuid import UUID
from app.db.models import AnalysisStatus

class ImageResponse(BaseModel):
    id: UUID
    file_path: str
    uploaded_at: datetime.datetime
    model_config = ConfigDict(from_attributes=True)

class AnalysisCreate(BaseModel):
    before_image_id: UUID
    after_image_id: UUID
    location_id: Optional[UUID] = None

class AnalysisResponse(BaseModel):
    id: UUID
    status: AnalysisStatus
    created_at: datetime.datetime
    completed_at: Optional[datetime.datetime] = None
    change_percentage: Optional[float] = None
    explanation: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class DetectedChangeSchema(BaseModel):
    id: UUID
    object_type: str
    confidence: float
    area: Optional[float] = None
    geometry: Any # Will be serialized as GeoJSON
    model_config = ConfigDict(from_attributes=True)

class AnalysisReport(AnalysisResponse):
    detected_changes: List[DetectedChangeSchema] = []
