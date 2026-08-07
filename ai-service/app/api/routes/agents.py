from fastapi import APIRouter

from app.models.schemas import AgentQueryRequest, AgentQueryResponse
from app.services.llm import chat_completion


router = APIRouter()

# In-memory session store for local dev only.
# Swap for Redis (see services/redis_cache.py) once you want sessions to survive a restart
# or to run more than one worker process.
_SESSIONS: dict[str, list[dict]] = {}

SYSTEM_PROMPT = (
    "You are a helpful support agent for an events company. "
    "Answer questions about event timing, location, and logistics clearly and concisely. "
    "If you don't have enough information, say so and ask a clarifying question."
)


@router.post("/social-support", response_model=AgentQueryResponse)
async def social_support_agent(payload: AgentQueryRequest) -> AgentQueryResponse:
    """
    Minimal working agent endpoint — mirrors the WhatsApp/Instagram/Facebook agent
    from the CV, scaled down to plain HTTP for local development.

    Flow: maintain per-session message history -> call the LLM -> return reply.
    Next step once this works: swap the in-memory _SESSIONS dict for Redis,
    and add tool-calling to fetch real event data instead of relying on the prompt alone.
    """
    history = _SESSIONS.setdefault(payload.session_id, [{"role": "system", "content": SYSTEM_PROMPT}])
    history.append({"role": "user", "content": payload.message})

    reply = await chat_completion(messages=history)

    history.append({"role": "assistant", "content": reply})

    return AgentQueryResponse(reply=reply, session_id=payload.session_id)
