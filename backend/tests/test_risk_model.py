from app.services.risk_model import normalize_temperature, risk_level, risk_score


def test_normalize_temperature_bounds() -> None:
    assert normalize_temperature(10) == 0.0
    assert normalize_temperature(45) == 1.0


def test_risk_formula() -> None:
    score = risk_score(0.8, 0.5)
    assert round(score, 2) == 68.0
    assert risk_level(score) == "warning"
