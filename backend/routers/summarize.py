from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.summarizer import generate_summary, get_available_styles
from routers.upload import SESSION_STORE

router = APIRouter()


class SummaryRequest(BaseModel):
    style: str = "executive"
    max_words: int | None = None


@router.get("/summary/styles")
async def available_styles():
    return {
        "available_styles": get_available_styles()
    }


@router.post("/summarize/{session_id}")
async def summarize_document(session_id: str, request: SummaryRequest):

    if session_id not in SESSION_STORE:
        raise HTTPException(status_code=404, detail="Invalid session")

    text = SESSION_STORE[session_id]["raw_text"]

    summary = generate_summary(text, request.style, request.max_words)

    return {
        "style_used": request.style,
        "summary": summary,
        "max_words": request.max_words
    }
