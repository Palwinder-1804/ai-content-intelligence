from fastapi import APIRouter, HTTPException
from models.schemas import QueryRequest
from services.chat_engine import chat_with_document
from routers.upload import SESSION_STORE

router = APIRouter()

@router.post("/chat/{session_id}")
async def chat(session_id: str, request: QueryRequest):

    if session_id not in SESSION_STORE:
        raise HTTPException(status_code=404, detail="Invalid session")

    vector_store = SESSION_STORE[session_id]["vector_store"]

    answer = chat_with_document(request.query, vector_store)

    return {
        "answer": answer
    }
