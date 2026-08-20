from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.db.database import get_db
from app.db.models import AnalysisJob, Location, AnalysisStatus
from app.schemas.schemas import AnalysisResponse

router = APIRouter()

@router.get("/{location_id}", response_model=list[AnalysisResponse])
def get_location_timeline(location_id: UUID, db: Session = Depends(get_db)):
    """
    Get a timeline of changes for a specific location.
    Returns completed analysis jobs for the location, ordered by completion date.
    """
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        # Actually for this hackathon, we might not have explicitly created locations.
        # Let's just filter analyses by location_id and see what's there
        pass
        
    analyses = db.query(AnalysisJob).filter(
        AnalysisJob.location_id == location_id,
        AnalysisJob.status == AnalysisStatus.COMPLETED
    ).order_by(AnalysisJob.completed_at.asc()).all()
    
    return analyses
