def chunk_text(text: str, chunk_size: int = 300, overlap: int = 50) -> list[str]:
    """
    Splits text into overlapping word-count chunks.

    chunk_size=300 words ≈ 400 tokens, a reasonable balance for retrieval precision
    vs. context per chunk. overlap=50 words means each chunk repeats the tail of the
    previous one, so we don't cut a sentence in half right at a chunk boundary and
    lose the answer that straddles it.
    """
    words = text.split()
    if not words:
        return []

    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap  # step forward, but re-include the overlap

    return chunks