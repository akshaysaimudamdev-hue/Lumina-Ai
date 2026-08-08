from fastapi import APIRouter
from pydantic import BaseModel

from services.router import ai_router


router = APIRouter()


class ChatRequest(BaseModel):

    question: str

    document_id: str | None = None

    user_name: str | None = None

    user_id: str | None = None


@router.post("/chat")
async def chat(
    request: ChatRequest
):

    print(
        "\n======= CHAT REQUEST ======="
    )

    print(
        "Question:",
        request.question
    )

    print(
        "Document ID:",
        request.document_id
    )

    print(
        "User Name:",
        request.user_name
    )

    print(
        "User ID:",
        request.user_id
    )

    print(
        "============================"
    )


    answer = ai_router(
        request.question,

        request.document_id,

        request.user_name,

        request.user_id,
    )


    return {
        "answer": answer
    }