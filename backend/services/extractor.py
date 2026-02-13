import fitz
from PIL import Image
import pytesseract
import whisper
import torch

whisper_model = whisper.load_model("medium")

def extract_pdf(file):
    text = ""
    with fitz.open(stream=file.read(), filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text


def extract_image(file):
    img = Image.open(file)
    return pytesseract.image_to_string(img)


def extract_video(file_path):
    result = whisper_model.transcribe(file_path)
    return result["text"]
