from services.embeddings import embed_query
from services.llm import generate_text


def chat_with_document(query: str, vector_store, top_k: int = 5):
    """
    Hybrid chat: answers from the uploaded document when relevant, otherwise uses
    general knowledge. Combines vector search (document retrieval) with LLM reasoning.
    """
    # 1) Retrieve relevant chunks via vector search (document context)
    query_embedding = embed_query(query)
    chunks = vector_store.search(query_embedding, top_k=top_k)
    has_context = bool(chunks)
    joined_context = "\n\n---\n\n".join(chunks) if chunks else "(No matching content in uploaded document)"

    # 2) Build prompt for hybrid behavior: document-first when relevant, else general knowledge
    prompt = f"""You are a helpful AI assistant. The user has an uploaded document, and you have access to the most relevant excerpts for their question.

User question: {query}

Relevant excerpts from uploaded document:
{joined_context}

Instructions:
- If the question is about the uploaded content and the excerpts above are relevant: answer primarily from the document excerpts. Be specific and cite the document.
- If the question is general (facts, how-to, explanations, etc.) or the excerpts don't match: use your knowledge to give a helpful answer.
- If they ask about something not in the document and it's document-related: say you couldn't find that in the document, then offer what you know if helpful.
- Be concise but complete. Adapt your response length to the question.
"""

    answer = generate_text(prompt, temperature=0.5)
    return answer
