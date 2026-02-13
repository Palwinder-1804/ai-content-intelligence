import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "mistral"   # or llama3


def generate_text(prompt: str, temperature: float = 0.7):

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "temperature": temperature,
            "stream": False
        }
    )

    if response.status_code != 200:
        return "Error generating response from Ollama."

    return response.json()["response"]
