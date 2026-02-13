from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, summarize, search, chat, video, flashcards

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(summarize.router)
app.include_router(search.router)
app.include_router(chat.router)
app.include_router(video.router)
app.include_router(flashcards.router)
