from services.chroma_service import search_documents
from services.llm import ask_gemini


def rag_chat(
    question: str,
    document_id: str,
    user_name: str = "",
) -> str:

    print("\n========== RAG ==========")

    print(
        "Question:",
        question
    )

    print(
        "Document ID:",
        document_id
    )

    # =================================================
    # DOCUMENT CHECK
    # =================================================

    if not document_id:

        return (
            "Please upload a PDF first."
        )

    # =================================================
    # SEARCH CHROMADB
    # =================================================

    print(
        "\nSearching ChromaDB..."
    )

    results = search_documents(
        question,
        document_id
    )

    if not results:

        return (
            "I couldn't find any content from "
            "this PDF. Please upload the PDF again."
        )

    print(
        f"Retrieved {len(results)} chunks"
    )

    # =================================================
    # EXTRACT CONTENT
    # =================================================

    chunks = []

    for result in results:

        if isinstance(
            result,
            str
        ):

            chunks.append(
                result
            )

        elif isinstance(
            result,
            dict
        ):

            text = (
                result.get("text")
                or result.get("content")
                or result.get("document")
            )

            if text:

                chunks.append(
                    text
                )

    if not chunks:

        return (
            "I found the PDF, but couldn't "
            "extract its text."
        )

    context = (
        "\n\n---\n\n".join(
            chunks
        )
    )

    print(
        "Context length:",
        len(context)
    )

    # =================================================
    # RAG PROMPT
    # =================================================

    prompt = f"""
You are Lumina AI, an intelligent PDF study assistant.

The user has uploaded a PDF.

User name:
{user_name or "User"}

User question:
{question}

==================================================
RETRIEVED PDF CONTENT
==================================================

{context}

==================================================
IMPORTANT RULES
==================================================

1. The PDF IS uploaded.

2. Answer using the retrieved PDF content when
   the user's question is about the PDF.

3. Never claim that the PDF was not uploaded.

4. If the user asks:
   "summarize the pdf"
   "summarise the pdf"
   "give summary"
   "explain this pdf"

   provide a structured summary based on the
   retrieved content.

5. If the question is unrelated to the PDF,
   answer the general question normally.

   Example:
   If the user asks:
   "What is the capital of Japan?"

   answer:
   "The capital of Japan is Tokyo."

6. Do not force unrelated questions to use
   the PDF.

7. Do not invent information.

8. When answering from the PDF, clearly distinguish
   information supported by the retrieved content.

9. Use headings and bullet points when useful.

10. If the user asks for code, provide complete code.

Answer naturally and professionally.
"""

    # =================================================
    # GEMINI
    # =================================================

    print(
        "\nSending context to Gemini..."
    )

    answer = ask_gemini(
        prompt
    )

    return answer