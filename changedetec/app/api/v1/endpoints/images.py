import shutil
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Image
from app.schemas.schemas import ImageResponse
from app.core.config import settings

router = APIRouter()

@router.post("/upload", response_model=ImageResponse, status_code=status.HTTP_201_CREATED)
async def upload_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Upload a satellite image for analysis.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    # Create a unique filename to prevent overwriting
    file_ext = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_location = Path(settings.UPLOAD_DIR) / unique_filename

    # Save the file
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    # Save to database
    db_image = Image(file_path=str(file_location))
    db.add(db_image)
    db.commit()
    db.refresh(db_image)

    return db_image
