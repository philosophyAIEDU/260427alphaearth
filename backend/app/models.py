from __future__ import annotations

from pydantic import BaseModel, Field


class RiskRequest(BaseModel):
    lat: float = Field(..., ge=33.0, le=39.5, description="Latitude in South Korea bounds")
    lon: float = Field(..., ge=124.0, le=132.0, description="Longitude in South Korea bounds")


class RiskResponse(BaseModel):
    lat: float
    lon: float
    similarity: float = Field(..., ge=0.0, le=1.0)
    normalized_temperature: float = Field(..., ge=0.0, le=1.0)
    risk_score: float = Field(..., ge=0.0, le=100.0)
    risk_level: str
    source: str


class RouteRequest(BaseModel):
    start_lat: float = Field(..., ge=33.0, le=39.5)
    start_lon: float = Field(..., ge=124.0, le=132.0)
    end_lat: float = Field(..., ge=33.0, le=39.5)
    end_lon: float = Field(..., ge=124.0, le=132.0)


class RoutePoint(BaseModel):
    lat: float
    lon: float
    risk: float = Field(..., ge=0.0, le=100.0)


class RouteResponse(BaseModel):
    points: list[RoutePoint]
    average_risk: float = Field(..., ge=0.0, le=100.0)
    recommended: str
