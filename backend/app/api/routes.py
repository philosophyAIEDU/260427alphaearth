from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models import RiskRequest, RiskResponse, RoutePoint, RouteRequest, RouteResponse
from app.services.embedding_service import EmbeddingService
from app.services.gee_service import GEEService
from app.services.risk_model import normalize_temperature, risk_level, risk_score
from app.services.weather_service import WeatherService

router = APIRouter()

gee_service = GEEService()
embedding_service = EmbeddingService()
weather_service = WeatherService()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/risk", response_model=RiskResponse)
def get_risk(payload: RiskRequest) -> RiskResponse:
    try:
        embedding = gee_service.generate_embedding(payload.lat, payload.lon)
    except Exception as exc:  # pragma: no cover - defensive path
        raise HTTPException(status_code=503, detail=f"Satellite embedding unavailable: {exc}") from exc

    if embedding is None or embedding.shape[0] != 64:
        raise HTTPException(status_code=503, detail="Satellite embedding missing or malformed")

    forecast = weather_service.get_forecast(payload.lat, payload.lon)
    similarity = embedding_service.max_heat_similarity(embedding)
    norm_temp = normalize_temperature(forecast.temperature_c)
    score = risk_score(similarity, norm_temp)

    return RiskResponse(
        lat=payload.lat,
        lon=payload.lon,
        similarity=round(similarity, 4),
        normalized_temperature=round(norm_temp, 4),
        risk_score=round(score, 2),
        risk_level=risk_level(score),
        source="mock-gee+mock-weathernext",
    )


@router.post("/route", response_model=RouteResponse)
def get_route(payload: RouteRequest) -> RouteResponse:
    # Lightweight, compute-efficient interpolation for MVP.
    # In production, integrate road graph + routing engine.
    points: list[RoutePoint] = []
    n = 8
    for i in range(n + 1):
        t = i / n
        lat = payload.start_lat + (payload.end_lat - payload.start_lat) * t
        lon = payload.start_lon + (payload.end_lon - payload.start_lon) * t
        risk = get_risk(RiskRequest(lat=lat, lon=lon)).risk_score
        points.append(RoutePoint(lat=lat, lon=lon, risk=risk))

    avg_risk = sum(p.risk for p in points) / len(points)
    return RouteResponse(
        points=points,
        average_risk=round(avg_risk, 2),
        recommended="current_path" if avg_risk < 55 else "consider_alternate_or_time_shift",
    )
