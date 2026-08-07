from typing import Any

import chromadb
from chromadb.api.models.Collection import Collection

from app.core.config import settings

_client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)

def get_collection(name: str = "docs") -> Collection:
    """
    Returns a Chroma collection for storing/retrieving embeddings.
    Note: Chroma is a local vector database that persists to disk. In production,
    you might use a managed vector DB like Pinecone or Weaviate instead.
    """
    return _client.get_collection(name=name)

def add_documents(
        collection_name: str,
        ids: list[str], 
        embeddings: list[list[float]],
        documents: list[str], 
        metadatas: list[dict],
    ) -> None:
    collection = get_collection(collection_name)
    collection.add(ids=ids, embeddings=embeddings, documents=documents, metadatas=metadatas)

def query_similar(
        collection_name: str,
        query_embedding: list[float],
        top_k: int = 4,
        filters: dict[str, str] | None = None
    ) -> dict:
    collection = get_collection(collection_name)
    return collection.query(query_embeddings=[query_embedding], n_results=top_k)

