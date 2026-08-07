from app.services.llm import embed_text


async def embed_chunks(chunks: list[str], task_type: str = "retrieval_document") -> list[list[float]]:
    """
        Embeds a list of text chunks one at a time.
        Note: OpenAI's embeddings endpoint actually supports batch input (a list of
        strings in one call), which is cheaper and faster than looping. Left as a
        loop here for clarity — batching it is a good follow-up optimization to
        mention in an interview ("I'd batch these to cut API round-trips").
    """
    return [await embed_text(chunk, task_type=task_type) for chunk in chunks]

# async def embed_chunks(chunks: list[str]) -> list[list[float]]:
#     """
#     Embeds a list of text chunks one at a time.
#     Note: OpenAI's embeddings endpoint actually supports batch input (a list of
#     strings in one call), which is cheaper and faster than looping. Left as a
#     loop here for clarity — batching it is a good follow-up optimization to
#     mention in an interview ("I'd batch these to cut API round-trips").
#     """
#     return [await embed_text(chunk) for chunk in chunks]