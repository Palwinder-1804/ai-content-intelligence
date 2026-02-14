import re
import json
from services.llm import generate_text

_MAX_WORDS = 3500


def _parse_json_flashcards(output: str) -> list[dict]:
    """Try to parse JSON format: [{"question":"...","answer":"..."}] or similar."""
    cleaned = re.sub(r"```(?:json)?\s*", "", output).strip()
    cleaned = re.sub(r"```\s*$", "", cleaned).strip()
    start = cleaned.find("[")
    if start < 0:
        return []
    depth = 0
    for i, c in enumerate(cleaned[start:], start):
        if c == "[":
            depth += 1
        elif c == "]":
            depth -= 1
            if depth == 0:
                try:
                    data = json.loads(cleaned[start : i + 1])
                    cards = []
                    for item in (data if isinstance(data, list) else []):
                        if isinstance(item, dict):
                            q = item.get("question") or item.get("q") or item.get("Question")
                            a = item.get("answer") or item.get("a") or item.get("Answer")
                            if q and a:
                                cards.append({"question": str(q).strip(), "answer": str(a).strip()})
                    return cards
                except json.JSONDecodeError:
                    break
    return []


def _parse_qa_flashcards(output: str) -> list[dict]:
    """Fallback: parse Q:/A: or Question:/Answer: style lines."""
    flashcards = []
    current = None

    # Match Q:/Question: or A:/Answer: with flexible formatting
    q_pattern = re.compile(r"^\s*(?:Q\.?|Question)\s*[:\.]\s*(.+)$", re.IGNORECASE)
    a_pattern = re.compile(r"^\s*(?:A\.?|Answer)\s*[:\.]\s*(.+)$", re.IGNORECASE)

    for line in output.split("\n"):
        q_match = q_pattern.match(line.strip())
        a_match = a_pattern.match(line.strip())

        if q_match:
            if current and current.get("answer"):
                flashcards.append(current)
            current = {"question": q_match.group(1).strip(), "answer": ""}
        elif a_match and current:
            current["answer"] = a_match.group(1).strip()
            flashcards.append(current)
            current = None

    if current and current.get("answer"):
        flashcards.append(current)

    return flashcards


def generate_flashcards(text: str) -> list[dict]:
    """
    Generate 6 educational flashcards from document content.
    Uses JSON output when possible, with regex fallback for Q/A format.
    """
    words = text.split()
    if len(words) > _MAX_WORDS:
        text = " ".join(words[:_MAX_WORDS]) + "\n\n[Content truncated for processing.]"

    prompt = f"""From the document content below, generate exactly 6 educational flashcards.

IMPORTANT: Respond ONLY with a valid JSON array. No other text. Example format:
[
  {{"question": "What is X?", "answer": "X is..."}},
  {{"question": "Why does Y?", "answer": "Y because..."}}
]

Use "question" and "answer" as the keys. Create clear, study-worthy questions and concise answers.

Document content:
{text}
"""

    output = generate_text(prompt, temperature=0.5)

    # Try JSON first
    flashcards = _parse_json_flashcards(output)
    if flashcards:
        return flashcards[:6]

    # Fallback to Q:/A: parsing
    flashcards = _parse_qa_flashcards(output)
    if flashcards:
        return flashcards[:6]

    # Last resort: try simple Q: / A: (original logic)
    flashcards = []
    current = {}
    for line in output.split("\n"):
        line = line.strip()
        if line.upper().startswith("Q:") or line.upper().startswith("Q."):
            current = {"question": line[2:].lstrip(". ").strip(), "answer": ""}
        elif (line.upper().startswith("A:") or line.upper().startswith("A.")) and current:
            current["answer"] = line[2:].lstrip(". ").strip()
            flashcards.append(current)
            current = {}
    if current and current.get("answer"):
        flashcards.append(current)

    return flashcards[:6]
