from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
import uuid

from services.pdf_loader import extract_text
from services.chunking import split_text
from services.embeddings import create_embeddings
from services.vector_store import store_embeddings


router = APIRouter()


UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True,
)


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...)
):

    try:

        # =================================================
        # VALIDATE FILE
        # =================================================

        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="No file selected.",
            )

        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are supported.",
            )


        # =================================================
        # DOCUMENT ID
        # =================================================

        document_id = str(
            uuid.uuid4()
        )


        # =================================================
        # SAVE PDF
        # =================================================

        file_path = os.path.join(
            UPLOAD_DIR,
            f"{document_id}_{file.filename}",
        )


        with open(
            file_path,
            "wb",
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer,
            )


        print(
            "\n========== PDF UPLOAD =========="
        )

        print(
            "Filename:",
            file.filename,
        )

        print(
            "Document ID:",
            document_id,
        )


        # =================================================
        # EXTRACT TEXT
        # =================================================

        text = extract_text(
            file_path
        )


        if not text or not text.strip():

            raise HTTPException(
                status_code=400,
                detail=(
                    "No text found inside PDF. "
                    "The PDF may contain scanned images."
                ),
            )


        print(
            "Extracted characters:",
            len(text),
        )


        # =================================================
        # CHUNK
        # =================================================

        chunks = split_text(
            text
        )


        if not chunks:

            raise HTTPException(
                status_code=400,
                detail="Could not create PDF chunks.",
            )


        print(
            "Created chunks:",
            len(chunks),
        )


        # =================================================
        # EMBEDDINGS
        # =================================================

        embeddings = create_embeddings(
            chunks
        )


        # =================================================
        # STORE IN CHROMA
        # =================================================

        store_embeddings(
            chunks=chunks,
            embeddings=embeddings,
            document_id=document_id,
            filename=file.filename,
        )


        print(
            "PDF successfully stored in ChromaDB."
        )


        # =================================================
        # RESPONSE
        # =================================================

        return {
            "success": True,
            "document_id": document_id,
            "filename": file.filename,
            "chunks": len(chunks),
        }


    except HTTPException:
        raise


    except Exception as error:

        print(
            "\nPDF upload error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to process PDF."
            ),
        )