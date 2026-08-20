import datetime
from sqlalchemy.orm import Session
from app.db.models import AnalysisJob, AnalysisStatus, DetectedChange
from app.ml.mock_model import ai_pipeline
from app.db.database import SessionLocal

def process_analysis_background(job_id: str):
    """
    Background task to run AI inference and save results to DB.
    """
    db: Session = SessionLocal()
    try:
        job = db.query(AnalysisJob).filter(AnalysisJob.id == job_id).first()
        if not job:
            return

        job.status = AnalysisStatus.PROCESSING
        db.commit()

        # In a real scenario we'd fetch the actual image paths
        # before_img = job.before_image.file_path
        # after_img = job.after_image.file_path
        
        # Run inference
        results = ai_pipeline.run_inference("dummy_path_1", "dummy_path_2")
        
        # Save results
        job.change_percentage = results.get("change_percentage")
        job.explanation = results.get("explanation")
        job.status = AnalysisStatus.COMPLETED
        job.completed_at = datetime.datetime.utcnow()
        
        for change_data in results.get("changes", []):
            new_change = DetectedChange(
                analysis_id=job.id,
                object_type=change_data["object_type"],
                confidence=change_data["confidence"],
                area=change_data["area"],
                geometry=change_data["geometry"]
            )
            db.add(new_change)
            
        db.commit()

    except Exception as e:
        db.rollback()
        job = db.query(AnalysisJob).filter(AnalysisJob.id == job_id).first()
        if job:
            job.status = AnalysisStatus.FAILED
            job.explanation = f"Error during processing: {str(e)}"
            db.commit()
    finally:
        db.close()
