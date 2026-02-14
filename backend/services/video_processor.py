import yt_dlp
import whisper
import tempfile
from services.summarizer import generate_summary

# Load lighter whisper model
whisper_model = whisper.load_model("base")


def extract_uploaded_video(file):

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        tmp.write(file.read())
        tmp_path = tmp.name

    result = whisper_model.transcribe(tmp_path)
    return result["text"]


def extract_youtube_video(url: str):

    ydl_opts = {
        "format": "mp4",
        "outtmpl": "video.mp4"
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    result = whisper_model.transcribe("video.mp4")

    return result["text"]


def summarize_youtube(url: str):

    transcript = extract_youtube_video(url)

    summary = generate_summary(transcript, style="executive")

    return summary
