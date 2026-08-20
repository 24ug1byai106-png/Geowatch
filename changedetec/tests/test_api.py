from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/api/v1/")
    # If router doesn't define /, the main app defines / at root
    # So we'll test the root endpoint
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the SIH Change Detection API"}

def test_upload_missing_file():
    response = client.post("/api/v1/images/upload")
    assert response.status_code == 422 # Unprocessable Entity due to missing file

# Further testing would require mocking the database session, which is beyond basic sample tests.
