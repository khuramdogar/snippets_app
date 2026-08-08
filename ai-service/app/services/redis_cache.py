import json
from typing import Any

import redis.asyncio as redis

from app.core.config import settings

_pool = redis.from_url(settings.REDIS_URL, decode_responses=True)


async def get_cached(key: str) -> Any | None:
    value = await _pool.get(key)
    return json.loads(value) if value else None


async def set_cached(key: str, value: Any, ttl_seconds: int | None = None) -> None:
    await _pool.set(key, json.dumps(value), ex=ttl_seconds or settings.REDIS_CACHE_TTL_SECONDS)


def cache_key_for_prompt(prompt: str, model: str) -> str:
    """
    Deterministic key so identical prompts hit cache instead of calling the LLM again.
    This is the concrete answer to 'how would you cut LLM cost in production' in an interview.
    """
    import hashlib

    digest = hashlib.sha256(f"{model}:{prompt}".encode()).hexdigest()
    return f"llm_cache:{digest}"
