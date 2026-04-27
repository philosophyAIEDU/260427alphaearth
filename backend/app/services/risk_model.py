from __future__ import annotations


def normalize_temperature(temp_c: float, min_c: float = 15.0, max_c: float = 42.0) -> float:
    if temp_c <= min_c:
        return 0.0
    if temp_c >= max_c:
        return 1.0
    return (temp_c - min_c) / (max_c - min_c)


def risk_score(similarity: float, normalized_temperature: float) -> float:
    # User formula: risk = 0.6 * similarity + 0.4 * normalized_temperature
    score_0_1 = (0.6 * similarity) + (0.4 * normalized_temperature)
    return max(0.0, min(100.0, score_0_1 * 100.0))


def risk_level(score: float) -> str:
    if score >= 75:
        return "danger"
    if score >= 50:
        return "warning"
    if score >= 25:
        return "caution"
    return "safe"
