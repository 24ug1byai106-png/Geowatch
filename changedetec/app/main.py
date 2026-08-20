from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.db.database import engine, Base
from app.core.config import settings

# In a real app we might use Alembic, but for this hackathon
# we'll auto-create tables on startup if they don't exist
# We also need to ensure PostGIS extension exists in the db
def init_db():
    try:
        # Create extension if not exists requires superuser, usually done in db setup
        # For docker, the postgis image handles it.
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Error creating tables: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Satellite Image Change Detection",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the SIH Change Detection API"}
