# 🛰️ GeoWatch: AI-Powered Geospatial Change Detection Platform

> **Smart India Hackathon (SIH) Problem Statement**: `SIH260009` — *Automated change detection due to human activities using multi-temporal Earth Observation satellite imagery.*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?style=flat&logo=React&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6.svg?style=flat&logo=TypeScript&logoColor=white)](https://www.typescriptlang.org)
[![PostGIS](https://img.shields.io/badge/PostGIS-PostgreSQL-336791.svg?style=flat&logo=PostgreSQL&logoColor=white)](https://postgis.net)
[![OpenCV](https://img.shields.io/badge/OpenCV-Python-5C3EE8.svg?style=flat&logo=OpenCV&logoColor=white)](https://opencv.org)
[![Groq Llama 3.3](https://img.shields.io/badge/LLM-Groq%20Llama%203.3%2070B-f55036.svg?style=flat)](https://groq.com)

---

## 📌 Overview

**GeoWatch** is an end-to-end geospatial intelligence and remote-sensing change detection system designed to autonomously monitor, classify, and explain human-driven physical landscape changes between temporal satellite passes (e.g. **Sentinel-2B Level-1C / Level-2A MSI**).

It bridges the gap between raw multi-spectral satellite imagery and actionable civic governance by identifying **new building construction**, **transportation corridor expansions**, **tree canopy clearance / deforestation**, and **zoning compliance risks**.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Ingestion ["🛰️ Satellite Data Ingestion"]
        S2_2024["Sentinel-2B (T1 - 2024)"]
        S2_2026["Sentinel-2B (T2 - 2026)"]
        Upload["Custom Multi-Spectral Upload\n(GeoTIFF, PNG, JPEG2000, ZIP)"]
    end

    subgraph Processing ["⚡ Remote-Sensing Pipeline"]
        CloudMask["☁️ Atmospheric & Cloud Filter\n(Otsu Spectral Mask)"]
        CoReg["📐 Radiometric Co-Registration\n& Histogram Normalization"]
        Diff["🔬 Pixel-wise Spectral Differencing\nΔ = √[(R₂-R₁)² + (G₂-G₁)² + (B₂-B₁)²]"]
        Contour["📊 Morphological Clustering\n(Bounding Vectors & GSD Scaling)"]
    end

    subgraph AI ["🧠 Multimodal AI & Analytics"]
        Groq["🦙 Groq Llama 3.3 70B Engine\n(Executive Civic Intelligence)"]
        CivicAudit["🏛️ Civic & Municipal Audit\n(Roads, Buildings, Trees, Tax)"]
        AskAI["🤖 Contextual Ask GeoWatch Assistant"]
    end

    subgraph Outputs ["🗺️ Interactive Outputs"]
        GISMap["🗺️ Interactive Leaflet GIS Map\n(Building Blueprints & Tree Markers)"]
        GeoJSON["📂 PostGIS & GeoJSON API\n(Vector Polygons Export)"]
        Timeline["📈 Multi-Year Historical Timeline"]
    end

    S2_2024 --> CloudMask
    S2_2026 --> CloudMask
    Upload --> CloudMask

    CloudMask --> CoReg --> Diff --> Contour
    Contour --> CivicAudit
    Contour --> Groq --> AskAI
    Contour --> GISMap
    Contour --> GeoJSON
    CivicAudit --> Timeline
```

---

## ✨ Key Features

### 1. 🛰️ Multi-Temporal Change Detection
- **Cloud-Masked Differencing**: Filters bright cloud patches and atmospheric artifacts to avoid false-positive detections.
- **Comparison Modes**: Includes `SPLIT VIEW`, interactive `SWIPE` slider, `OVERLAY` opacity slider, and dedicated `CHANGE MAP`.

### 2. 🏛️ Government & Civic Infrastructure Audit
- 🛣️ **Roads Expanded**: Measures linear transport network expansion (+km) and paved asphalt footprint ($m^2$).
- 🏢 **Buildings Constructed**: Identifies discrete structural footprints, high-density clusters, and estimated municipal property tax additions.
- 🌳 **Trees Felled / Canopy Loss**: Quantifies green canopy displaced and calculates the **1:10 Compensatory Reforestation Target**.
- ⚖️ **Zoning & Municipal Compliance**: Flags unauthorized peripheral encroachments and provides municipal recommendations.

### 3. 🗺️ Interactive GIS Vector Map
- **Blueprint Vector Outlines**: Displays geometric architectural building footprints (🏢) and tree canopy clusters (🌳).
- **Interactive Multi-Basemap**: Switch seamlessly between **Satellite** (Google/Esri), **OSM** (CartoDB Voyager), and **Dark Matter**.
- **Confidence Threshold Slider (`50% – 95%`)**: Dynamically filters false positives in real time.

### 4. 🤖 Contextual "Ask GeoWatch" AI Assistant
- Powered by **Groq Llama 3.3 70B Versatile**.
- Indexed with live calculated telemetry to answer specific queries:
  - *"What are the major human-made changes?"*
  - *"How many buildings and roads were expanded?"*
  - *"What is the estimated tree canopy loss?"*

### 5. 📂 PostGIS & GeoJSON Vector Storage
- Stores detected change geometries directly in PostGIS tables.
- 1-click **GeoJSON Export** with GPS coordinates, area ($m^2$), confidence, and classification properties.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Leaflet, Lucide Icons, Vanilla CSS (Aerospace Dark HUD) |
| **Backend** | FastAPI, Python 3.11, Uvicorn, SQLAlchemy, GeoAlchemy2, PostGIS |
| **Computer Vision** | OpenCV (cv2), NumPy, Pillow, Glymur (JPEG2000 parser) |
| **AI / LLM** | Groq Cloud SDK (`llama-3.3-70b-versatile`) |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18+` or `v20+`
- **Python**: `3.10+` or `3.11+`
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/24ug1byai106-png/Geowatch.git
cd Geowatch
```

### 2. Frontend Setup & Launch
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at:* **`http://localhost:5173`**

### 3. Backend Setup & Launch
```bash
cd changedetec
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*FastAPI Docs available at:* **`http://localhost:8000/docs`**

---

## ⚙️ Environment Configuration

Create a `.env` file in `changedetec/` or `frontend/`:

```env
# Optional Groq API Key for LLM Explanations (Pre-configured in client)
VITE_GROQ_API_KEY=your_groq_api_key_here

# PostgreSQL / PostGIS Database URL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/geowatch_db
```

---

## 📄 License & Attribution

- **Sentinel-2 Data**: Copernicus Sentinel data [2024–2026] processed by ESA / ISRO Bhuvan / GeoWatch Engine.
- Built for **Smart India Hackathon (SIH 2024/2026)**.
