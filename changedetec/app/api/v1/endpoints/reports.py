from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.db.database import get_db
from app.db.models import AnalysisJob, DetectedChange, AnalysisStatus
from app.schemas.schemas import AnalysisReport, DetectedChangeSchema

router = APIRouter()

@router.get("/{analysis_id}", response_model=AnalysisReport)
def get_analysis_report(analysis_id: UUID, db: Session = Depends(get_db)):
    """
    Generate a structured summary report of the analysis.
    """
    job = db.query(AnalysisJob).filter(AnalysisJob.id == analysis_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Analysis job not found")
        
    if job.status != AnalysisStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Analysis is not completed.")

    changes = db.query(DetectedChange).filter(DetectedChange.analysis_id == analysis_id).all()
    
    # We need to construct the response, avoiding raw PostGIS geometries in the json
    # For a full report, we might want to return coordinates, but for now we skip geometry in the schema or mock it.
    
    # The DetectedChangeSchema requires geometry, we can set it to None or a mock string in the report
    
    changes_list = []
    for c in changes:
        changes_list.append(DetectedChangeSchema(
            id=c.id,
            object_type=c.object_type,
            confidence=c.confidence,
            area=c.area,
            geometry=None # Omit heavy geometry from the textual report
        ))

    report = AnalysisReport.model_validate(job)
    report.detected_changes = changes_list
    
    return report
