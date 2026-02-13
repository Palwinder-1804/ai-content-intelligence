from services.llm import generate_text

SUMMARY_STYLES = {
    "executive": "Provide a strategic executive-level summary.",
    "technical": "Provide a detailed technical breakdown.",
    "beginner": "Explain in simple beginner-friendly language.",
    "academic": "Provide an academic structured summary.",
    "marketing": "Summarize highlighting value and impact.",
    "investor": "Summarize as an investor pitch.",
    "bullet": "Summarize in concise bullet points.",
    "analytical": "Provide analytical insights and implications."
}


def get_available_styles():
    return list(SUMMARY_STYLES.keys())


def generate_summary(text: str, style: str = "executive", max_words: int = None):

    style_prompt = SUMMARY_STYLES.get(style, SUMMARY_STYLES["executive"])
    
    # Add length constraint if specified
    length_constraint = ""
    if max_words:
        if max_words <= 50:
            length_constraint = " Keep it very brief (maximum 50 words). Use bullet points or short sentences."
        elif max_words <= 100:
            length_constraint = " Keep it concise (maximum 100 words). Use bullet points or brief paragraphs."
        elif max_words <= 200:
            length_constraint = " Keep it moderate length (maximum 200 words)."
        else:
            length_constraint = f" Maximum {max_words} words."

    prompt = f"""
    {style_prompt}{length_constraint}

    Content:
    {text[:4000]}
    """

    summary = generate_text(prompt, temperature=0.7)
    
    # Post-process to ensure length if specified (applies to all max_words values)
    if max_words:
        words = summary.split()
        if len(words) > max_words:
            # Truncate intelligently at sentence boundaries
            truncated = " ".join(words[:max_words])
            # Try to end at a sentence
            last_period = truncated.rfind(".")
            last_exclamation = truncated.rfind("!")
            last_question = truncated.rfind("?")
            last_sentence_end = max(last_period, last_exclamation, last_question)
            # For longer summaries, allow more flexibility in finding sentence end
            min_sentence_end_position = max_words * 0.7 if max_words <= 200 else max_words * 0.85
            if last_sentence_end > min_sentence_end_position:
                summary = truncated[:last_sentence_end + 1]
            else:
                summary = truncated + "..."
    
    return summary
