from pydantic import BaseModel, Field


# --- Agents ---
class AgentQueryRequest(BaseModel):
    message: str = Field(..., description="The user's incoming message, e.g. from WhatsApp/Instagram.")
    session_id: str = Field(..., description="Conversation/session identifier for context continuity.")


class AgentQueryResponse(BaseModel):
    reply: str
    session_id: str


# --- RAG ---
class RagQueryRequest(BaseModel):
    question: str
    top_k: int = 4
    collection_name: str = "General"
    filters: dict[str, str] = Field(default_factory=dict, description="Optional metadata filters for retrieval.")


class RagQueryResponse(BaseModel):
    answer: str
    sources: list[str] = []

class RagDocumentRequest(BaseModel):
    document: str
    metadata: dict = Field(default_factory=dict)


class RagDocumentResponse(BaseModel):
    message: str


# --- Scoring ---
class ScoringRequest(BaseModel):
    transcript: str = Field(..., description="Interview transcript text to score.")


class ScoringResponse(BaseModel):
    confidence: int = Field(..., ge=1, le=100)
    clarity: int = Field(..., ge=1, le=100)
    communication: int = Field(..., ge=1, le=100)
    fit: int = Field(..., ge=1, le=100)
    overall: int = Field(..., ge=1, le=100)
    reasoning: str


# --- Recommend ---
class RecommendRequest(BaseModel):
    user_profile: str = Field(..., description="Free-text profile, e.g. prescription + face shape.")
    top_k: int = 3


class RecommendedItem(BaseModel):
    name: str
    reason: str


class RecommendResponse(BaseModel):
    items: list[RecommendedItem]
