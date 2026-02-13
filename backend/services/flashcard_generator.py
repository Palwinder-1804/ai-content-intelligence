from services.llm import generate_text

def generate_flashcards(text):

    prompt = f"""
    From the content below, generate 6 educational flashcards.

    Format:
    Q: question
    A: answer

    Content:
    {text}
    """

    output = generate_text(prompt, temperature=0.7)

    flashcards = []
    current = {}

    for line in output.split("\n"):
        if line.startswith("Q:"):
            current = {"question": line[2:].strip(), "answer": ""}
        elif line.startswith("A:") and current:
            current["answer"] = line[2:].strip()
            flashcards.append(current)
            current = {}

    return flashcards
