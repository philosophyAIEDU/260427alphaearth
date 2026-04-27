from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_risk_endpoint() -> None:
    res = client.post("/api/risk", json={"lat": 37.5665, "lon": 126.9780})
    assert res.status_code == 200
    body = res.json()
    assert 0 <= body["risk_score"] <= 100
    assert body["risk_level"] in {"safe", "caution", "warning", "danger"}


def test_risk_validation_error() -> None:
    res = client.post("/api/risk", json={"lat": 80.0, "lon": 126.9780})
    assert res.status_code == 422
