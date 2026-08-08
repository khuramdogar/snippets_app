from langchain_core.prompts import ChatPromptTemplate


RAG_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are a helpful assistant.

Answer the user's question using ONLY the provided context.

If the context does not contain enough information to answer,
say that you don't have enough information.

Do not make up information.""",
        ),
        (
            "human",
            """Context:
{context}

Question:
{question}""",
        ),
    ]
)