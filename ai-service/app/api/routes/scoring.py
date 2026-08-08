from fastapi import APIRouter, HTTPException

from app.models.schemas import ScoringRequest, ScoringResponse

router = APIRouter()

SCORING_RUBRIC_PROMPT = """\
You are scoring a job interview transcript. Score each dimension from 1-100:
- confidence
- clarity
- communication
- fit

Return ONLY valid JSON matching this shape:
{{"confidence": int, "clarity": int, "communication": int, "fit": int, "overall": int, "reasoning": str}}

Transcript:
{transcript}
"""


@router.post("/interview", response_model=ScoringResponse)
async def score_interview(payload: ScoringRequest) -> ScoringResponse:
    """
    TODO (module 6 — AI Scoring Pipelines):
    1. Format SCORING_RUBRIC_PROMPT with payload.transcript
    2. Call chat_completion() with temperature=0 for consistency
    3. Parse the JSON response into ScoringResponse (use pydantic's model_validate_json,
       wrapped in try/except since LLMs occasionally return malformed JSON)
    4. For real reliability: sample 3x and average, or use OpenAI's structured output /
       response_format=json_schema instead of prompting for JSON

    This mirrors the HireWithTess 1-100 scoring engine from your CV — rebuild it here
    in isolation so you can defend the design choices (why temp=0, how you handle
    malformed output, how you'd validate the rubric against human-labeled examples).
    """
    raise HTTPException(status_code=501, detail="Not implemented yet — module 6 exercise")
