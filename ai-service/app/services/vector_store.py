from typing import Any

import chromadb
from chromadb.api.models.Collection import Collection

from app.core.config import settings

_client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)

def add_documents(
        collection_name: str,
        ids: list[str], 
        embeddings: list[list[float]],
        documents: list[str], 
        metadatas: list[dict],
    ) -> None:
    lower_collection_name = collection_name.lower()
    collection = _client.get_or_create_collection(name=lower_collection_name)
    collection.add(ids=ids, embeddings=embeddings, documents=documents, metadatas=metadatas)

def query_similar(
        collection_name: str,
        query_embedding: list[float],
        top_k: int = 4,
        filters: dict[str, str] | None = None
    ) -> dict:
    lower_collection_name = collection_name.lower()
    try:
        collection = _client.get_collection(name=lower_collection_name)
    except chromadb.errors.NoCollectionError:
        raise ValueError(f"Collection '{collection_name}' does not exist. Please ingest documents first.")
    return collection.query(query_embeddings=[query_embedding], n_results=top_k)

