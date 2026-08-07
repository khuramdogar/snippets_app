import os

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Central config, loaded from environment variables / .env file.
    Using pydantic-settings gives us validation + type safety for free —
    the app will fail fast at startup if a required var is missing or malformed,
    instead of failing later mid-request.
    """

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # --- Provider switch ---
    LLM_PROVIDER: str = "gemini"  # "openai" or "gemini" — this one value controls everything
    LLM_EMBEDDING_PROVIDER: str = "gemini"  # "openai" or "gemini" — this one value controls everything
    LLM_CHAT_PROVIDER: str = "openai"  # "openai" or "gemini" — this one value controls everything

    # --- OpenAI ---
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-small"
    OPENAI_BASE_URL: str = "https://openrouter.ai/api/v1"

    # --- Gemini ---
    # GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    # GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-pro")
    # GEMINI_EMBEDDING_MODEL: str = "gemini-embedding-001"
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.0-flash"
    GEMINI_EMBEDDING_MODEL: str = "models/gemini-embedding-001"

    # --- Redis (caching layer) ---
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_CACHE_TTL_SECONDS: int = 3600

    # --- Vector store ---
    VECTOR_STORE_PROVIDER: str = "chroma"  # "chroma" for local dev, "pinecone" for prod
    PINECONE_API_KEY: str = ""
    PINECONE_INDEX_NAME: str = "snippets-app-rag"
    CHROMA_PERSIST_DIR: str = "./ai-service/chroma_data"

    # --- Kafka (added later, once endpoints work standalone) ---
    KAFKA_BOOTSTRAP_SERVERS: str = "localhost:9092"
    KAFKA_CONSUMER_GROUP: str = "ai-service"

    # --- App ---
    CORS_ORIGINS: list[str] = ["http://localhost:8000", "http://localhost:8000"]  # Next.js dev server
    LOG_LEVEL: str = "INFO"


settings = Settings()
