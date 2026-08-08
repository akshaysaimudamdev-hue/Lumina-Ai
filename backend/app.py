from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.upload import router as upload_router
from api.chat import router as chat_router
from api.summary import router as summary_router


app = FastAPI(
    title="AI Search RAG API",
    version="1.0.0",
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# ROUTES
# =====================================================

app.include_router(
    upload_router,
    prefix="/api",
)

app.include_router(
    chat_router,
    prefix="/api",
)

app.include_router(
    summary_router,
    prefix="/api",
)


# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/")
def home():
    return {
        "status": "online",
        "message": "AI Search Backend Running 🚀",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }