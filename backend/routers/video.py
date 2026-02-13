from fastapi import APIRouter
from models.schemas import VideoRequest
from services.video_processor import summarize_youtube

router = APIRouter()

@router.post("/video/summarize")
async def summarize_video(request: VideoRequest):

    summary = summarize_youtube(request.url)

    return {
        "summary": summary
    }
