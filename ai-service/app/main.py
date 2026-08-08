from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import agents, rag, scoring, recommend

app = FastAPI(
    title="snippets_app AI Service",
    description="Python/FastAPI microservice for AI agents, RAG, scoring, and recommendations.",
    version="0.1.0"
)

# Allow the Next.js frontend / RoR backend to call this service during local dev.
# Tighten this list before deploying anywhere real.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents.router, prefix="/agents", tags=["agents"])
app.include_router(rag.router, prefix="/rag", tags=["rag"])
app.include_router(scoring.router, prefix="/scoring", tags=["scoring"])
app.include_router(recommend.router, prefix="/recommend", tags=["recommend"])


@app.get("/health")
async def health_check():
    """Basic liveness check — hit this first to confirm the service is up."""
    return {"status": "ok", "service": "ai-service"}
