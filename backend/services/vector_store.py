import chromadb
from sentence_transformers import SentenceTransformer

# Persistent Chroma Database
client = chromadb.PersistentClient(path="vector_db")

collection = client.get_or_create_collection(
    name="pdf_documents"
)

# Embedding model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")


def store_embeddings(
    chunks,
    embeddings,
    document_id,
    filename,
):
    """
    Store embeddings along with metadata so that
    multiple PDFs can exist inside the same database.
    """

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
    metadatas = [
    {
        "document_id": document_id,
        "filename": filename,
        "chunk": i,
    }
    for i in range(len(chunks))
]


def search_text(
    query,
    document_id,
    n_results=10,
):
    """
    Search inside the selected PDF.
    """

    print("\nSearching ChromaDB...")
    print("Document ID:", document_id)

    query_embedding = embedding_model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
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

    documents = results.get("documents", [[]])[0]
    distances = results.get("distances", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]

    print(f"Retrieved {len(documents)} chunks")

    return documents, distances, metadatas


def get_uploaded_documents():
    """
    Returns every uploaded PDF exactly once.
    """

    data = collection.get(
        include=["metadatas"]
    )

    documents = {}

    for meta in data["metadatas"]:
        documents[meta["document_id"]] = meta["filename"]

    return [
        {
            "id": doc_id,
            "filename": filename,
        }
        for doc_id, filename in documents.items()
    ]