import numpy as np

from app.services.embedding_service import EmbeddingService


def test_cosine_similarity_identical_vectors() -> None:
    service = EmbeddingService()
    v = np.ones(64, dtype=np.float32)
    assert round(service.cosine_similarity(v, v), 4) == 1.0


def test_cosine_similarity_zero_vector() -> None:
    service = EmbeddingService()
    a = np.zeros(64, dtype=np.float32)
    b = np.ones(64, dtype=np.float32)
    assert service.cosine_similarity(a, b) == 0.0
