import json
from json import JSONDecodeError

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from langchain_core.documents import Document
from langchain_core.runnables import RunnablePassthrough

from app.services.langchain_vector_store import get_retriever
from app.services.prompts import RAG_PROMPT
from app.services.providers.langchain_openai_provider import get_llm

from app.models.schemas import RagQueryRequest, RagQueryResponse, RagDocumentRequest, RagDocumentResponse
from app.services.document_ingest import ingest_upload

router = APIRouter()


def format_documents(documents: list[Document]) -> str:
    return "\n\n---\n\n".join(
        document.page_content
        for document in documents
    )

@router.post("/query", response_model=RagQueryResponse)
async def rag_query(payload: RagQueryRequest) -> RagQueryResponse:
    retriever = get_retriever(
        collection_name=payload.collection_name,
        top_k=payload.top_k,
    )

    documents = await retriever.ainvoke(
        payload.question
    )

    if not documents:
        return RagQueryResponse(
            answer="I don't have any relevant documents to answer that yet.",
            sources=[],
        )

    context = format_documents(documents)

    llm = get_llm(temperature=0)

    response = await (
        RAG_PROMPT
        | llm
    ).ainvoke(
        {
            "context": context,
            "question": payload.question,
        }
    )

    sources = sorted(
        {
            document.metadata.get("source")
            for document in documents
            if document.metadata.get("source")
        }
    )

    return RagQueryResponse(
        answer=response.content,
        sources=sources,
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
