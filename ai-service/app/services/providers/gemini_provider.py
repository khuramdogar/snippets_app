import google.generativeai as genai

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

genai.configure(api_key=settings.GEMINI_API_KEY)
_model = genai.GenerativeModel(settings.GEMINI_MODEL)


async def chat_completion(messages: list[dict], temperature: float = 0.3) -> str:
    """
    Gemini's SDK doesn't use OpenAI's {"role": ..., "content": ...} message list
    directly — it wants role "user"/"model" (not "assistant"), and no "system" role
    in the history itself. We convert here so the CALLER never has to know that.
    """
    system_instruction = None
    history = []

    for msg in messages:
        if msg["role"] == "system":
            system_instruction = msg["content"]
        elif msg["role"] == "assistant":
            history.append({"role": "model", "parts": [msg["content"]]})
        else:  # "user"
            history.append({"role": "user", "parts": [msg["content"]]})

    model = genai.GenerativeModel(settings.GEMINI_MODEL, system_instruction=system_instruction)

    # The last message is the new prompt; everything before it is chat history.
    *previous_turns, latest = history
    chat = model.start_chat(history=previous_turns)

    response = await chat.send_message_async(
        latest["parts"][0],
        generation_config={"temperature": temperature},
    )

    logger.info("gemini chat_completion done | model=%s", settings.GEMINI_MODEL)
    return response.text

async def embed_text(text: str, task_type: str = "retrieval_document") -> list[float]:
    result = genai.embed_content(
        model=settings.GEMINI_EMBEDDING_MODEL,
        content=text,
        task_type=task_type,
        # title="Embedding for RAG",
        output_dimensionality=768,  # truncate from the default 3072 — smaller, faster, still strong
    )
    embedding = result["embedding"]

    if isinstance(embedding, list) and len(embedding) == 1 and isinstance(embedding[0], list):
        embedding = embedding[0]

    return embedding