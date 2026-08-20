import uuid
import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geometry
from app.db.database import Base
import enum

class AnalysisStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class Location(Base):
    __tablename__ = "locations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    images = relationship("Image", back_populates="location")
    analyses = relationship("AnalysisJob", back_populates="location")

class Image(Base):
    __tablename__ = "images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=True)
    file_path = Column(String, nullable=False)
    capture_date = Column(DateTime, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    location = relationship("Location", back_populates="images")

class AnalysisJob(Base):
    __tablename__ = "analysis_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=True)
    before_image_id = Column(UUID(as_uuid=True), ForeignKey("images.id"))
    after_image_id = Column(UUID(as_uuid=True), ForeignKey("images.id"))
    status = Column(Enum(AnalysisStatus), default=AnalysisStatus.PENDING)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    change_percentage = Column(Float, nullable=True)
    explanation = Column(Text, nullable=True)
    
    location = relationship("Location", back_populates="analyses")
    before_image = relationship("Image", foreign_keys=[before_image_id])
    after_image = relationship("Image", foreign_keys=[after_image_id])
    detected_changes = relationship("DetectedChange", back_populates="analysis")

class DetectedChange(Base):
    __tablename__ = "detected_changes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("analysis_jobs.id"))
    object_type = Column(String, index=True) # e.g. "building", "road"
    confidence = Column(Float)
    area = Column(Float, nullable=True) # Estimated area
    
    # Store the actual polygon in PostGIS
    geometry = Column(Geometry('POLYGON', srid=4326), nullable=True)
    
    analysis = relationship("AnalysisJob", back_populates="detected_changes")
