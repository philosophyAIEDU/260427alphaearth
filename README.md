# AI Disaster Prevention MVP (Korea)

Production-oriented MVP combining AlphaEarth-like embeddings and WeatherNext-like forecasts for heat-risk prediction.

## Architecture Overview

This project is divided into two main parts:
- **Backend (FastAPI)**: A Python-based REST API that processes geospatial coordinates and returns heat risk scores and route predictions. It is equipped with CORS middleware to allow the frontend to communicate with it.
  - `POST /api/risk`: Evaluates the heat risk for a specific location.
  - `POST /api/route`: Generates a heat-risk profile along a sampled route.
- **Frontend (React + Vite)**: A responsive Single Page Application (SPA) that uses Mapbox GL to visualize heat risk and routing.
  - Uses modern React hooks and integrates with the browser's Geolocation API.
  - Registers a Service Worker (PWA) to cache assets.

## Deployment to Netlify

To deploy the frontend to Netlify, simply connect this repository. We have configured the `netlify.toml` file so that Netlify automatically builds the `frontend` directory and properly routes all SPA traffic to `index.html` (which prevents the "Page Not Found" error).

**Important**: Netlify only hosts the frontend. Your FastAPI backend must be deployed separately (e.g., on Render, Heroku, or AWS). 

Once your backend is deployed, you **must** configure the following environment variables in your Netlify dashboard (Site Settings -> Environment variables):
- `VITE_API_BASE`: The URL of your deployed backend (e.g., `https://my-backend.onrender.com/api`)
- `VITE_MAPBOX_TOKEN`: Your Mapbox access token.

## Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Frontend setup

```bash
cd frontend
npm install
export VITE_API_BASE=http://localhost:8000/api
export VITE_MAPBOX_TOKEN=your_mapbox_token
npm run dev
```

## Tests

```bash
cd backend
PYTHONPATH=. pytest -q
```
