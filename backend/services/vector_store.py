import faiss
import numpy as np

class VectorStore:

    def __init__(self, embeddings, texts):

        self.texts = texts

        embeddings = np.array(embeddings)

        if len(embeddings.shape) == 1:
            embeddings = embeddings.reshape(1, -1)

        self.index = faiss.IndexFlatL2(embeddings.shape[1])
        self.index.add(embeddings.astype("float32"))

    def search(self, query_embedding, top_k=3):

        query_embedding = np.array(query_embedding)

        if len(query_embedding.shape) == 1:
            query_embedding = query_embedding.reshape(1, -1)

        distances, indices = self.index.search(
            query_embedding.astype("float32"),
            top_k
        )

        results = []
        for i in indices[0]:
            if i < len(self.texts):
                results.append(self.texts[i][:500])  # limit output size

        return results
