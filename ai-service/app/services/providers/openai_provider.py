from openai import AsyncOpenAI

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

_client = AsyncOpenAI(
    api_key=settings.OPENAI_API_KEY,
    base_url=settings.OPENAI_BASE_URL or None,  # None = OpenAI's default endpoint
)


async def chat_completion(messages: list[dict], temperature: float = 0.3) -> str:
    response = await _client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=messages,
        temperature=temperature,
    )
    usage = response.usage
    logger.info(
        "openai-compatible chat_completion done | model=%s prompt_tokens=%s completion_tokens=%s",
        settings.OPENAI_MODEL,
        usage.prompt_tokens if usage else "?",
        usage.completion_tokens if usage else "?",
    )
    return response.choices[0].message.content


async def embed_text(text: str, task_type: str = "retrieval_document") -> list[float]:
    # task_type is a Gemini-only concept, ignored here — kept in the signature
    # so both providers have an identical function signature (see llm.py below).
    response = await _client.embeddings.create(
        model=settings.OPENAI_EMBEDDING_MODEL,
        input=text,
    )
    return response.data[0].embedding