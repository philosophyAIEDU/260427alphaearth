from __future__ import annotations

import hashlib

import numpy as np


class GEEService:
    """Mock-safe GEE service.

    In production, replace generate_embedding with real Earth Engine extraction.
    """

    def generate_embedding(self, lat: float, lon: float) -> np.ndarray:
        seed_input = f"{lat:.5f}:{lon:.5f}".encode("utf-8")
        seed = int(hashlib.sha256(seed_input).hexdigest()[:8], 16)
        rng = np.random.default_rng(seed)
        # 64-dim AlphaEarth-style embedding vector
        vector = rng.uniform(0.0, 1.0, size=64).astype(np.float32)
        return vector
