from services.embeddings import embed_query
from services.llm import generate_text


def semantic_search(query, vector_store, top_k: int = 3, max_words: int = 120):
    """
    Run semantic search over the indexed document and return
    a query-specific summary instead of raw matching chunks.

    - Uses the vector store to retrieve the top-k relevant chunks.
    - Sends the query + retrieved chunks to the LLM.
    - Returns a focused answer plus the underlying supporting chunks.
    """

    # 1) Retrieve most relevant chunks via vector similarity
    query_embedding = embed_query(query)
    chunks = vector_store.search(query_embedding, top_k=top_k)

    # If for some reason we have no chunks, short‑circuit
    if not chunks:
        return {
            "answer": "I couldn't find any content related to your question in the uploaded document.",
            "contexts": [],
        }

    # 2) Build a prompt that asks for a concise, query‑specific answer
    joined_context = "\n\n---\n\n".join(chunks)

    prompt = f"""
You are an assistant that answers questions based ONLY on the provided document excerpts.

User question:
{query}

Relevant document excerpts:
{joined_context}

Task:
- Give a focused answer to the user's specific question.
- Do NOT summarize the whole document, only the parts relevant to the question.
- Be concise and practical.
- Answer in at most {max_words} words.
"""

    answer = generate_text(prompt, temperature=0.4)

    return {
        "answer": answer,
        "contexts": chunks,
    }
