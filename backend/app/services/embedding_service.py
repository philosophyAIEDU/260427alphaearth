from __future__ import annotations

import numpy as np


HEAT_TRAP_LIBRARY = [
    np.array([0.95 if i % 5 == 0 else 0.35 for i in range(64)], dtype=np.float32),
    np.array([0.75 if i % 7 == 0 else 0.45 for i in range(64)], dtype=np.float32),
    np.array([0.85 if i % 11 == 0 else 0.40 for i in range(64)], dtype=np.float32),
]


class EmbeddingService:
    """Embedding operations with fallback-safe math for production resilience."""

    @staticmethod
    def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
        denom = np.linalg.norm(a) * np.linalg.norm(b)
        if denom == 0:
            return 0.0
        value = float(np.dot(a, b) / denom)
        # Keep bounded due to floating-point drift.
        return max(min(value, 1.0), -1.0)

    def max_heat_similarity(self, embedding: np.ndarray) -> float:
        similarities = [self.cosine_similarity(embedding, ref) for ref in HEAT_TRAP_LIBRARY]
        # Convert [-1, 1] to [0,1] for risk model.
        normalized = [(s + 1.0) / 2.0 for s in similarities]
        return float(max(normalized))
