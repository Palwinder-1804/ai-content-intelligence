def split_into_chunks(text, max_words=150, overlap=30):

    words = text.split()
    chunks = []

    for i in range(0, len(words), max_words - overlap):
        chunk = " ".join(words[i:i + max_words])
        chunks.append(chunk)

    return chunks
