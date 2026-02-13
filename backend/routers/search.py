from fastapi import APIRouter, HTTPException
from models.schemas import QueryRequest
from services.search_engine import semantic_search
from routers.upload import SESSION_STORE

router = APIRouter()


@router.post("/search/{session_id}")
async def search_document(session_id: str, request: QueryRequest):
    """
    Perform a semantic search and return a query‑specific summary.

    Response shape:
    {
        "answer": str,        # concise answer to the query
        "contexts": [str, ...]  # raw supporting chunks used for the answer
    }
    """

    if session_id not in SESSION_STORE:
        raise HTTPException(status_code=404, detail="Invalid session")

    vector_store = SESSION_STORE[session_id]["vector_store"]

    result = semantic_search(request.query, vector_store)

    return result
