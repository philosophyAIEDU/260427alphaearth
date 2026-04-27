from __future__ import annotations

from dataclasses import dataclass


@dataclass
class WeatherForecast:
    temperature_c: float
    humidity_pct: float


class WeatherService:
    """WeatherNext adapter with deterministic mock fallback."""

    def get_forecast(self, lat: float, lon: float) -> WeatherForecast:
        # Mock: deterministic but location-aware synthetic weather
        # Korea summer-like range for heat prediction demo
        base = 26.0 + ((lat - 33.0) / 6.5) * 4.0 + ((lon - 124.0) / 8.0) * 3.0
        humidity = 55.0 + ((lon - 124.0) / 8.0) * 25.0
        return WeatherForecast(temperature_c=round(base, 2), humidity_pct=round(humidity, 2))
