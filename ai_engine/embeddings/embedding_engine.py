import os
import numpy as np
from typing import List

class EmbeddingEngine:
    """
    Computes vector embeddings for passages and queries.
    Uses SentenceTransformers when cached locally or enabled, with a resilient fallback vectorizer.
    """

    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = None
        self.is_sentence_transformer = False
        self._initialized = False

    def _init_model(self):
        if self._initialized:
            return
        self._initialized = True

        # Only attempt remote download if explicitly enabled with HF key
        if os.getenv("ENABLE_HF_DOWNLOAD", "False").lower() in ("true", "1"):
            try:
                from sentence_transformers import SentenceTransformer
                self.model = SentenceTransformer(self.model_name)
                self.is_sentence_transformer = True
                return
            except Exception:
                pass

        self.model = None
        self.is_sentence_transformer = False

    def embed_texts(self, texts: List[str]) -> np.ndarray:
        if not texts:
            return np.zeros((0, 384), dtype=np.float32)

        self._init_model()

        if self.is_sentence_transformer and self.model:
            try:
                embeddings = self.model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
                return embeddings.astype(np.float32)
            except Exception:
                pass

        return self._fallback_embed(texts)

    def embed_query(self, query: str) -> np.ndarray:
        embeddings = self.embed_texts([query])
        return embeddings[0] if len(embeddings) > 0 else np.zeros((384,), dtype=np.float32)

    def _fallback_embed(self, texts: List[str], dim: int = 384) -> np.ndarray:
        results = []
        for text in texts:
            vec = np.zeros(dim, dtype=np.float32)
            words = text.lower().split()
            if not words:
                results.append(vec)
                continue

            for w in words:
                h = abs(hash(w))
                idx = h % dim
                sign = 1.0 if (h // dim) % 2 == 0 else -1.0
                vec[idx] += sign

            norm = np.linalg.norm(vec)
            if norm > 0:
                vec = vec / norm
            results.append(vec)

        return np.array(results, dtype=np.float32)

embedding_engine = EmbeddingEngine()
