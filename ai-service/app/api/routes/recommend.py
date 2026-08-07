from fastapi import APIRouter, HTTPException

from app.models.schemas import RecommendRequest, RecommendResponse

router = APIRouter()


@router.post("/products", response_model=RecommendResponse)
async def recommend_products(payload: RecommendRequest) -> RecommendResponse:
    """
    TODO (module 7 — Recommendation engine):
    1. Load a small product catalog (data/products.json — name + description)
    2. Embed each product description once, cache the vectors (Redis or a local file)
    3. Embed payload.user_profile, rank products by cosine similarity
    4. For each top match, ask the LLM for a one-line "reason" tying the profile to the product

    This rebuilds Eyelux's prescription/face-shape -> sunglasses recommendation flow
    from your CV, in isolation, so you can explain the ranking logic and the
    cold-start problem (what happens with a brand new product with no interaction data).
    """
    raise HTTPException(status_code=501, detail="Not implemented yet — module 7 exercise")
