from langdetect import detect
from transformers import pipeline
from core.config import DEVICE
import threading

# Thread-safe lazy loading
_translator = None
_lock = threading.Lock()


def get_translator():
    global _translator

    # Prevent multiple threads loading model at same time
    if _translator is None:
        with _lock:
            if _translator is None:
                _translator = pipeline(
                    model="Helsinki-NLP/opus-mt-mul-en",
                    device=0 if DEVICE == "cuda" else -1
                )

    return _translator


def translate_if_needed(text: str) -> str:
    """
    Detect language and translate to English if needed.
    Returns original text if:
    - Language is English
    - Detection fails
    - Translation fails
    """

    try:
        lang = detect(text)

        if lang != "en":
            translator = get_translator()
            result = translator(text)
            return result[0]["translation_text"]

    except Exception as e:
        print(f"[Translator Warning] {e}")

    return text
