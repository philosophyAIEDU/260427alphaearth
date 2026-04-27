# AI Disaster Prevention MVP (Korea)

Production-oriented MVP combining AlphaEarth-like embeddings and WeatherNext-like forecasts for heat-risk prediction.

## Architecture

- **Backend**: FastAPI (`backend/app`)
  - `POST /api/risk`: returns heat risk score 0–100 for a location.
  - `POST /api/route`: samples route points and returns route heat-risk profile.
- **Frontend**: React + Vite + Mapbox (`frontend/src`)
  - Geolocation-based risk lookup
  - Heat score visualization and route risk view
- **PWA**
  - Service worker cache for core assets and GET requests
  - Web manifest for installable app behavior

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


## Netlify deployment (SPA)

When deploying on Netlify from this monorepo layout, set the frontend as build base.
This repository already includes `netlify.toml` for that:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect: `/* -> /index.html (200)`

If you configured Netlify manually before, remove conflicting settings and redeploy.
