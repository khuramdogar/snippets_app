from langchain_chroma import Chroma

from app.core.config import settings
from app.services.providers.langchain_gemini_provider import get_embeddings


def get_vector_store(collection_name: str) -> Chroma:
    return Chroma(
        collection_name=collection_name.lower(),
        embedding_function=get_embeddings(),
        persist_directory=settings.CHROMA_PERSIST_DIR,
    )

def get_retriever(
    collection_name: str,
    top_k: int = 4,
):
    vector_store = get_vector_store(collection_name)

    return vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={
            "k": top_k,
        },
    )