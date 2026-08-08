from fastapi import APIRouter

router = APIRouter()

@router.post("/summary")
async def summary():
    return {
        "summary": "Summary endpoint working."
    }