import sys
from pathlib import Path

# Add the parent directory (ai-service) to Python's module search path
sys.path.insert(0, str(Path(__file__).parent.parent))
"""
Ingests markdown files from a docs folder into Chroma.

Usage:
    python scripts/ingest_docs.py --path ./data/docs

Run this whenever you add or change source documents.
"""

import argparse
import asyncio
import hashlib
from pathlib import Path

from app.services.chunking import chunk_text
from app.services.embeddings import embed_chunks
from app.services.vector_store import add_documents


def make_chunk_id(source_file: str, chunk_index: int) -> str:
    raw = f"{source_file}:{chunk_index}"
    return hashlib.md5(raw.encode()).hexdigest()


async def ingest_folder(folder: Path, collection_name: str = "docs") -> None:
    md_files = list(folder.glob("**/*.md"))
    if not md_files:
        print(f"No markdown files found in {folder}")
        return

    for file_path in md_files:
        text = file_path.read_text(encoding="utf-8")
        chunks = chunk_text(text)

        if not chunks:
            continue

        print(f"Embedding {len(chunks)} chunks from {file_path.name}...")
        embeddings = await embed_chunks(chunks)

        ids = [make_chunk_id(str(file_path), i) for i in range(len(chunks))]
        metadatas = [{"source": str(file_path), "chunk_index": i} for i in range(len(chunks))]

        add_documents(
            collection_name=collection_name,
            ids=ids,
            embeddings=embeddings,
            documents=chunks,
            metadatas=metadatas,
        )
        print(f"  -> stored {len(chunks)} chunks")

    print("Ingestion complete.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--path", type=str, required=True, help="Folder containing .md files")
    parser.add_argument("--collection", type=str, default="docs")
    args = parser.parse_args()

    asyncio.run(ingest_folder(Path(args.path), args.collection))
