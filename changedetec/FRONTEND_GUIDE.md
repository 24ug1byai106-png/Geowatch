# Frontend Integration Guide

Welcome! This guide is specifically for the frontend developer to quickly set up the backend on their local machine and start integrating the APIs.

## Prerequisites
- **Docker** and **Docker Compose** must be installed on your system.

## How to Start the Backend Locally

1. Open your terminal and navigate to this project folder (`changedetec`).
2. Run the following command to spin up the database and backend API:
   ```bash
   docker-compose up --build
   ```
   *(Note: The first time you run this, it will take a minute or two to download the database image and install the backend dependencies.)*
3. Wait until you see logs indicating that `Uvicorn running on http://0.0.0.0:8000` (FastAPI) and PostgreSQL is ready to accept connections.

## How to Test the APIs & Read Documentation

Once the backend is running, the **Swagger UI Interactive Documentation** is automatically generated for you.

- Go to your browser and open: **[http://localhost:8000/docs](http://localhost:8000/docs)**
- This page documents every single endpoint, exactly what JSON body it expects, and what JSON/GeoJSON it will return. 
- You can even click the **"Try it out"** button on any endpoint to make test requests directly from the browser!

## Integration Workflow Example

Here is the flow you will likely use when integrating the change detection into your UI:

1. **Upload Images**:
   - Send a `POST` request to `/api/v1/images/upload` with the "Before" image file. Save the returned `id`.
   - Send another `POST` request to `/api/v1/images/upload` with the "After" image file. Save the returned `id`.

2. **Start the AI Analysis**:
   - Send a `POST` request to `/api/v1/analysis` passing the two `id`s from step 1.
   - **Crucial Note**: AI processing is slow, so this endpoint returns *immediately* with an analysis `id` while the AI runs in the background.

3. **Check the Status**:
   - Polling: Send a `GET` request to `/api/v1/analysis/{analysis_id}` every few seconds. 
   - Wait until the `status` field changes from `"PROCESSING"` to `"COMPLETED"`.

4. **Render the Results**:
   - **Map Data**: Send a `GET` request to `/api/v1/analysis/{analysis_id}/map`. This returns a standard GeoJSON `FeatureCollection` containing all the detected changes (polygons/bounding boxes). You can feed this directly into map libraries like Leaflet, Mapbox, or Google Maps.
   - **Explanation**: Send a `GET` request to `/api/v1/analysis/{analysis_id}/explanation` to get the AI-generated human-readable summary of the changes to show on the side panel.

If you have any questions or need API modifications, just let the backend team know!
