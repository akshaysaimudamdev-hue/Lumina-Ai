import chromadb
from sentence_transformers import SentenceTransformer


# =====================================================
# CHROMA DATABASE
# =====================================================

client = chromadb.PersistentClient(
    path="vector_db"
)

collection = client.get_or_create_collection(
    name="pdf_documents"
)


# =====================================================
# EMBEDDING MODEL
# =====================================================

embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


# =====================================================
# STORE PDF EMBEDDINGS
# =====================================================

def store_embeddings(
    chunks,
    embeddings,
    document_id,
    filename,
):
    """
    Store PDF chunks and embeddings in ChromaDB.

    Each PDF is identified using document_id.
    """

    if not chunks:
        print("No chunks to store.")
        return

    ids = [
        f"{document_id}_{i}"
        for i in range(len(chunks))
    ]

    metadatas = [
        {
            "document_id": document_id,
            "filename": filename,
            "chunk": i,
        }
        for i in range(len(chunks))
    ]

    collection.upsert(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    print(
        f"Stored {len(chunks)} chunks "
        f"for document: {document_id}"
    )


# =====================================================
# SEARCH TEXT
# =====================================================

def search_text(
    query,
    document_id,
    n_results=10,
):
    """
    Search for relevant chunks inside one PDF.
    """

    print("\nSearching ChromaDB...")
    print(
        "Document ID:",
        document_id
    )

    if not document_id:
        print(
            "No document ID provided."
        )

        return [], [], []


    # =================================================
    # CREATE QUERY EMBEDDING
    # =================================================

    query_embedding = (
        embedding_model
        .encode(query)
        .tolist()
    )


    # =================================================
    # SEARCH
    # =================================================

    results = collection.query(
        query_embeddings=[
            query_embedding
        ],

        n_results=n_results,

        where={
            "document_id": document_id
        },

        include=[
            "documents",
            "distances",
            "metadatas",
        ],
    )


    # =================================================
    # EXTRACT RESULTS
    # =================================================

    documents = (
        results
        .get("documents", [[]])[0]
    )

    distances = (
        results
        .get("distances", [[]])[0]
    )

    metadatas = (
        results
        .get("metadatas", [[]])[0]
    )


    print(
        f"Documents Found: "
        f"{len(documents)}"
    )


    if distances:

        print(
            "Top Distance:",
            distances[0]
        )


    return (
        documents,
        distances,
        metadatas
    )


# =====================================================
# SEARCH DOCUMENTS
# =====================================================

def search_documents(
    query,
    document_id,
    n_results=10,
):
    """
    RAG-friendly search function.

    Returns a list of dictionaries containing:
    - text
    - distance
    - metadata
    """

    (
        documents,
        distances,
        metadatas
    ) = search_text(
        query,
        document_id,
        n_results
    )


    results = []


    for i, document in enumerate(
        documents
    ):

        distance = (
            distances[i]
            if i < len(distances)
            else None
        )

        metadata = (
            metadatas[i]
            if i < len(metadatas)
            else {}
        )


        results.append(
            {
                "text": document,

                "distance": distance,

                "metadata": metadata,
            }
        )


    print(
        f"Returning "
        f"{len(results)} chunks"
    )


    return results


# =====================================================
# GET ALL UPLOADED DOCUMENTS
# =====================================================

def get_uploaded_documents():
    """
    Return every uploaded PDF exactly once.
    """

    data = collection.get(
        include=[
            "metadatas"
        ]
    )


    documents = {}


    for metadata in (
        data.get("metadatas") or []
    ):

        if not metadata:
            continue


        document_id = metadata.get(
            "document_id"
        )

        filename = metadata.get(
            "filename"
        )


        if (
            document_id
            and filename
        ):

            documents[
                document_id
            ] = filename


    return [
        {
            "id": document_id,

            "filename": filename,
        }

        for document_id, filename
        in documents.items()
    ]


# =====================================================
# DELETE PDF FROM CHROMADB
# =====================================================

def delete_document(
    document_id
):
    """
    Delete all chunks belonging
    to a specific PDF.
    """

    if not document_id:
        return


    results = collection.get(
        where={
            "document_id": document_id
        },

        include=[
            "metadatas"
        ],
    )


    ids = results.get(
        "ids",
        []
    )


    if ids:

        collection.delete(
            ids=ids
        )


        print(
            f"Deleted {len(ids)} chunks "
            f"for document: {document_id}"
        )

    else:

        print(
            "No chunks found for "
            f"document: {document_id}"
        )