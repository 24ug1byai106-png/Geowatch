# SIH Change Detection API

This is the backend service for the Satellite Image Change Detection project for the SIH Internal Hackathon.

## Core Features
1. **Satellite Image Upload & Preprocessing**: Upload before/after images, validate format, and prepare for AI inference.
2. **AI-Based Change Detection**: Modular pipeline to compare images, generate a change mask, and calculate affected area.
3. **Human-Made Object Detection**: Identify specific changes (e.g., buildings, roads, construction) with confidence scores and bounding boxes/polygons.
4. **Change Map & Data Generation**: Return frontend-ready GeoJSON and geographic coordinates for easy map rendering.
5. **Detection History & Reports**: Store analysis history in PostgreSQL and generate structured summary reports.
6. **Automatic Change Explanation**: AI/service layer that converts detection results into a simple human-readable explanation.
7. **Change Timeline & Evolution Tracking**: Track how a detected object or location changes over multiple time periods.

## Tech Stack
- FastAPI (Python)
- PostgreSQL + PostGIS
- SQLAlchemy + GeoAlchemy2
- Pydantic
- Docker

## Setup Instructions

### 1. Environment Setup
Copy the example environment file and customize if needed:
```bash
cp .env.example .env
```

### 2. Run with Docker Compose
The easiest way to run the entire stack (Database + API) is using Docker Compose:
```bash
docker-compose up --build
```
This will start:
- **PostgreSQL** database on port 5432
- **FastAPI** web server on port 8000

### 3. API Documentation
Once the server is running, you can view the interactive API documentation (Swagger UI) at:
[http://localhost:8000/docs](http://localhost:8000/docs)

## Sample Usage (Demo)

1. **Upload Images**: Use the `/api/v1/images/upload` endpoint to upload a "before" and "after" image. Note the returned `id` for both.
2. **Start Analysis**: Use the `/api/v1/analysis` endpoint. Pass the two image IDs in the JSON body. Note the returned `id` (this is the Analysis Job ID).
3. **Check Status**: Poll `/api/v1/analysis/{analysis_id}` until the `status` is `COMPLETED`.
4. **Get Map Data**: Call `/api/v1/analysis/{analysis_id}/map` to get the GeoJSON FeatureCollection.

## Modular AI Pipeline
The AI pipeline logic is located in `app/ml/mock_model.py`. Currently, it uses a mock implementation that simulates a delay and returns random polygons. To replace this with a real model, update the `MockAIPipeline` class or replace it with a new class implementing the same interface.
