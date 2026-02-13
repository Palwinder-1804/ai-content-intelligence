from services.search_engine import semantic_search


def chat_with_document(query, vector_store):
    """
    Chat endpoint helper that answers using ONLY the uploaded document.

    It reuses `semantic_search` which:
    - retrieves the most relevant chunks from the vector store
    - calls the LLM with those chunks + the user question
    - returns a focused, query‑specific answer
    """

    result = semantic_search(query, vector_store)

    # `semantic_search` returns {"answer": str, "contexts": [str, ...]}
    return result.get("answer", "I could not find any answer based on the uploaded document.")
