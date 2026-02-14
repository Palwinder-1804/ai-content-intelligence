from fastapi import APIRouter, HTTPException
from services.insight_extractor import extract_insights
from routers.upload import SESSION_STORE

router = APIRouter()


@router.get("/insights/{session_id}")
async def get_insights(session_id: str):
    if session_id not in SESSION_STORE:
        raise HTTPException(status_code=404, detail="Invalid session")

    text = SESSION_STORE[session_id]["raw_text"]
    insights = extract_insights(text)
    return {"insights": insights}
