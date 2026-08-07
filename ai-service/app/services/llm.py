from app.core.config import settings
from app.services.providers import gemini_provider, openai_provider

_PROVIDERS = {
    "openai": openai_provider,
    "gemini": gemini_provider,
}


def _get_provider():
    provider = _PROVIDERS.get(settings.LLM_PROVIDER)
    if provider is None:
        raise ValueError(
            f"Unknown LLM_PROVIDER '{settings.LLM_PROVIDER}'. "
            f"Valid options: {list(_PROVIDERS.keys())}"
        )
    return provider


async def chat_completion(messages: list[dict], temperature: float = 0.3) -> str:
    # return await _get_provider().chat_completion(messages, temperature=temperature)
    return await openai_provider.chat_completion(messages, temperature=temperature)


async def embed_text(text: str, task_type: str = "retrieval_document") -> list[float]:
    # return await _get_provider().embed_text(text, task_type=task_type)
    return await gemini_provider.embed_text(text, task_type=task_type)