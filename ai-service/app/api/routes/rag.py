import json
from json import JSONDecodeError

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.models.schemas import RagQueryRequest, RagQueryResponse, RagDocumentRequest, RagDocumentResponse
from app.services.document_ingest import ingest_upload
from app.services.embeddings import embed_chunks
from app.services.vector_store import query_similar
from app.services.llm import chat_completion

router = APIRouter()

RAG_PROMPT_TEMPLATE = """\
Answer the question using ONLY the context below. If the context doesn't contain
the answer, say you don't have enough information — do not make something up.

Context:
{context}

Question: {question}

Answer:"""


@router.post("/query", response_model=RagQueryResponse)
async def rag_query(payload: RagQueryRequest) -> RagQueryResponse:
    # 1. Embed the question the same way we embedded the chunks at ingest time.
    #    (embed_chunks takes a list, so wrap/unwrap a single item)

    # [question_embedding] = await embed_chunks([payload.question])
    [query_embedding] = await embed_chunks([payload.question], task_type="retrieval_query")
    print(f"DEBUG query_embedding length: {len(query_embedding)}")  # add this line temporarily
    # 2. Retrieve the top_k most similar chunks from Chroma
    results = query_similar(
        collection_name=payload.collection_name,
        # query_embedding=query_embedding[0],
        query_embedding=query_embedding,
        top_k=payload.top_k,
        filters=payload.filters
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]

    if not documents:
        return RagQueryResponse(
            answer="I don't have any relevant documents to answer that yet.",
            sources=[],
        )

    # 3. Build the prompt with retrieved context
    context = "\n\n---\n\n".join(documents)
    prompt = RAG_PROMPT_TEMPLATE.format(context=context, question=payload.question)

    # 4. Ask the LLM, grounded in only what we retrieved
    response = await chat_completion(
         messages=[{"role": "user", "content": prompt}],
        temperature=0,  # deterministic — we want faithful answers, not creative ones
    )

    sources = sorted({m["source"] for m in metadatas})
    
    # 5. Return the answer and sources
    return RagQueryResponse(
        answer=response,
        sources=sources
    )


@router.post("/upload", response_model=RagDocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    source: str | None = Form(None),
    metadata: str | None = Form(None),
    collection_name: str = Form("General"),
) -> RagDocumentResponse:
    """Upload a PDF, DOCX, MD, TXT, CSV, or JSON document and ingest it into Chroma."""
    try:
        metadata_payload = json.loads(metadata) if metadata else {}
    except JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid metadata JSON: {exc}") from exc

    try:
        chunk_count = await ingest_upload(file=file, collection_name=collection_name, source=source, metadata=metadata_payload)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to ingest document: {exc}") from exc

    return RagDocumentResponse(
        message=f"Document ingested successfully with {chunk_count} chunks."
    )
