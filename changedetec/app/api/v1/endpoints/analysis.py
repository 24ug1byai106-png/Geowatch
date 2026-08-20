from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session
from uuid import UUID
from geoalchemy2.shape import to_shape
import json
from app.db.database import get_db
from app.db.models import AnalysisJob, Image, DetectedChange, Location, AnalysisStatus
from app.schemas.schemas import AnalysisCreate, AnalysisResponse, AnalysisReport
from app.services.analysis_service import process_analysis_background

router = APIRouter()

@router.post("", response_model=AnalysisResponse, status_code=status.HTTP_202_ACCEPTED)
def start_analysis(
    analysis_in: AnalysisCreate, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    """
    Start a new change detection analysis job between two images.
    Returns the job ID immediately while processing happens in the background.
    """
    # Verify images exist
    before = db.query(Image).filter(Image.id == analysis_in.before_image_id).first()
    after = db.query(Image).filter(Image.id == analysis_in.after_image_id).first()
    
    if not before or not after:
        raise HTTPException(status_code=404, detail="One or both images not found")

    # Create the job
    job = AnalysisJob(
        before_image_id=analysis_in.before_image_id,
        after_image_id=analysis_in.after_image_id,
        location_id=analysis_in.location_id
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Trigger background task
    background_tasks.add_task(process_analysis_background, str(job.id))

    return job

@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis_status(analysis_id: UUID, db: Session = Depends(get_db)):
    """
    Check the status and basic results of an analysis job.
    """
    job = db.query(AnalysisJob).filter(AnalysisJob.id == analysis_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Analysis job not found")
    
    return job

@router.get("", response_model=list[AnalysisResponse])
def list_analyses(db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    """
    List all analysis jobs.
    """
    jobs = db.query(AnalysisJob).offset(skip).limit(limit).all()
    return jobs

@router.get("/{analysis_id}/map")
def get_analysis_map(analysis_id: UUID, db: Session = Depends(get_db)):
    """
    Return GeoJSON data for the detected changes, ready for frontend map rendering.
    """
    job = db.query(AnalysisJob).filter(AnalysisJob.id == analysis_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Analysis job not found")
        
    if job.status != AnalysisStatus.COMPLETED:
        raise HTTPException(status_code=400, detail=f"Analysis is not completed. Current status: {job.status}")

    changes = db.query(DetectedChange).filter(DetectedChange.analysis_id == analysis_id).all()
    
    features = []
    for change in changes:
        # Convert PostGIS geometry to shapely shape, then to GeoJSON dict
        shape = to_shape(change.geometry)
        
        feature = {
            "type": "Feature",
            "geometry": shape.__geo_interface__,
            "properties": {
                "id": str(change.id),
                "object_type": change.object_type,
                "confidence": change.confidence,
                "area": change.area
            }
        }
        features.append(feature)
        
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    
    return geojson

@router.get("/{analysis_id}/explanation")
def get_analysis_explanation(analysis_id: UUID, db: Session = Depends(get_db)):
    """
    Return human readable explanation of the changes.
    """
    job = db.query(AnalysisJob).filter(AnalysisJob.id == analysis_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Analysis job not found")
        
    if job.status != AnalysisStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Analysis is not completed.")

    return {
        "explanation": job.explanation,
        "change_percentage": job.change_percentage
    }
