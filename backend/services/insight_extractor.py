from services.llm import generate_text

_MAX_WORDS = 4000


def extract_insights(text: str) -> list[str]:
    """
    Extract key insights, takeaways, and important points from document content.
    """
    words = text.split()
    if len(words) > _MAX_WORDS:
        text = " ".join(words[: _MAX_WORDS]) + "\n\n[Content truncated...]"

    prompt = f"""
From the document content below, extract 5–8 key insights or takeaways.

Format: Output each insight on its own line, starting with a hyphen and space.
Example:
- First key insight or takeaway
- Second important point
- Third actionable finding

Do NOT add numbers, headers, or extra text. Only list the insights.

Document content:
{text}
"""

    output = generate_text(prompt, temperature=0.3)
    insights = []
    for line in output.strip().split("\n"):
        line = line.strip()
        if line.startswith("-"):
            insights.append(line[1:].strip())
        elif line and not line.startswith("#"):
            insights.append(line)
    return [i for i in insights if i]
