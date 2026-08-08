from langchain_openai import ChatOpenAI

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

def get_llm(temperature: float = 0.3) -> ChatOpenAI:
    return ChatOpenAI(
        model=settings.OPENAI_MODEL,
        api_key=settings.OPENAI_API_KEY,
        base_url=settings.OPENAI_BASE_URL or None,
        temperature=temperature,
    )

async def chat_completion(
    messages: list[dict],
    temperature: float = 0.3,
) -> str:

    llm = get_llm(temperature=temperature)

    response = await llm.ainvoke(messages)

    logger.info(
        "langchain openai chat_completion done | model=%s",
        settings.OPENAI_MODEL,
    )

    return response.content