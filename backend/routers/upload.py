from fastapi import APIRouter, UploadFile
from pydantic import BaseModel
from uuid import uuid4

from services.extractor import extract_pdf, extract_image
from services.docx_extractor import extract_docx
from services.video_processor import extract_uploaded_video
from services.article_extractor import extract_article
from services.cleaner import clean_text
from services.translator import translate_if_needed
from utils.chunking import split_into_chunks
from services.embeddings import embed_texts
from services.vector_store import VectorStore

router = APIRouter()
SESSION_STORE = {}

class TextInput(BaseModel):
    text: str

class URLInput(BaseModel):
    url: str


@router.post("/upload/file")
async def upload_file(file: UploadFile):

    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        text = extract_pdf(file.file)

    elif filename.endswith(".docx"):
        text = extract_docx(file.file)

    elif filename.endswith((".png", ".jpg", ".jpeg")):
        text = extract_image(file.file)

    elif filename.endswith((".mp4", ".mov", ".mkv")):
        text = extract_uploaded_video(file.file)

    else:
        return {"error": "Unsupported file type"}

    text = clean_text(text)
    text = translate_if_needed(text)

    chunks = split_into_chunks(text)
    embeddings = embed_texts(chunks)

    vector_store = VectorStore(embeddings, chunks)

    session_id = str(uuid4())

    SESSION_STORE[session_id] = {
        "vector_store": vector_store,
        "raw_text": text
    }

    return {
        "message": "File indexed successfully",
        "session_id": session_id
    }


@router.post("/upload/text")
async def upload_text(data: TextInput):

    text = clean_text(data.text)
    text = translate_if_needed(text)

    chunks = split_into_chunks(text)
    embeddings = embed_texts(chunks)

    vector_store = VectorStore(embeddings, chunks)

    session_id = str(uuid4())

    SESSION_STORE[session_id] = {
        "vector_store": vector_store,
        "raw_text": text
    }

    return {
        "message": "Text indexed successfully",
        "session_id": session_id
    }


@router.post("/upload/article")
async def upload_article(data: URLInput):

    text = extract_article(data.url)

    text = clean_text(text)
    text = translate_if_needed(text)

    chunks = split_into_chunks(text)
    embeddings = embed_texts(chunks)

    vector_store = VectorStore(embeddings, chunks)

    session_id = str(uuid4())

    SESSION_STORE[session_id] = {
        "vector_store": vector_store,
        "raw_text": text
    }

    return {
        "message": "Article indexed successfully",
        "session_id": session_id
    }
