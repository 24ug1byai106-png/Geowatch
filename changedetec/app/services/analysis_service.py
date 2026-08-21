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

        import os
        before_path = job.before_image.file_path if job.before_image else "uploads/sentinel_2024_bengaluru.png"
        after_path = job.after_image.file_path if job.after_image else "uploads/sentinel_2026_bengaluru.png"
        
        if not os.path.exists(before_path):
            before_path = os.path.join(os.path.dirname(__file__), "..", "..", "uploads", "sentinel_2024_bengaluru.png")
        if not os.path.exists(after_path):
            after_path = os.path.join(os.path.dirname(__file__), "..", "..", "uploads", "sentinel_2026_bengaluru.png")

        # Run OpenCV differencing & contour extraction
        results = ai_pipeline.run_inference(before_path, after_path)
        
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
