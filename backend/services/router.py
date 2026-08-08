from services.intent import detect_intent
from services.code import generate_code
from services.rag import rag_chat
from services.llm import ask_gemini
from services.memory import add_message


# =====================================================
# QUESTIONS THAT SHOULD USE THE UPLOADED PDF
# =====================================================

def is_pdf_question(question: str) -> bool:

    q = question.lower().strip()

    pdf_keywords = [
        "pdf",
        "document",
        "resume",
        "cv",
        "uploaded file",
        "uploaded pdf",
        "this file",
        "this document",
        "according to the pdf",
        "according to the document",
        "from the pdf",
        "from the document",
        "in the pdf",
        "in the document",
        "summarise the pdf",
        "summarize the pdf",
        "summarise this",
        "summarize this",
        "summary of the pdf",
        "summary of this pdf",
        "explain the pdf",
        "explain this pdf",
        "what does the pdf say",
        "what does this document say",
        "tell me about this pdf",
        "tell me about this document",
    ]

    return any(
        keyword in q
        for keyword in pdf_keywords
    )


# =====================================================
# AI ROUTER
# =====================================================

def ai_router(
    question,
    document_id=None,
    user_name=None,
    user_id=None
):

    print("\n========== AI ROUTER ==========")

    print("Question:", question)
    print("Document:", document_id)
    print("User:", user_name)
    print("User ID:", user_id)

    print("================================")

    # =================================================
    # MEMORY
    # =================================================

    add_message(
        "user",
        question
    )

    # =================================================
    # INTENT
    # =================================================

    intent = detect_intent(question)

    print("Intent:", intent)

    # =================================================
    # CODE
    # =================================================

    if intent == "code":

        print("\n========== CODE ==========")

        answer = generate_code(
            question
        )

    # =================================================
    # PDF / RAG
    # =================================================

    elif (
        document_id
        and is_pdf_question(question)
    ):

        print("\n========== RAG ==========")
        print("Routing question to PDF RAG")

        answer = rag_chat(
            question,
            document_id,
            user_name
        )

    # =================================================
    # GENERAL AI
    # =================================================

    else:

        print("\n========== GENERAL AI ==========")
        print("Routing question to Gemini general knowledge")

        user_context = ""

        if user_name:

            user_context = f"""
The user's name is {user_name}.

Use the user's name naturally when appropriate.
Do not repeatedly mention their name.
"""

        answer = ask_gemini(
            question,
            user_context
        )

    # =================================================
    # MEMORY
    # =================================================

    add_message(
        "assistant",
        answer
    )

    return answer