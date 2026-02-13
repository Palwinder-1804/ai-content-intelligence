from fastapi import APIRouter, HTTPException
from services.flashcard_generator import generate_flashcards
from routers.upload import SESSION_STORE

router = APIRouter()

@router.get("/flashcards/{session_id}")
async def flashcards(session_id: str):

    if session_id not in SESSION_STORE:
        raise HTTPException(status_code=404, detail="Invalid session")

    text = SESSION_STORE[session_id]["raw_text"]

    cards = generate_flashcards(text)

    return {"flashcards": cards}
