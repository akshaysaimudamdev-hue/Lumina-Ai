from rank_bm25 import BM25Okapi

bm25 = None
documents = []


def build_index(chunks):

    global bm25
    global documents

    documents = chunks

    tokenized = [
        chunk.lower().split()
        for chunk in chunks
    ]

    bm25 = BM25Okapi(tokenized)


def keyword_search(query, top_k=5):

    global bm25

    if bm25 is None:
        return []

    scores = bm25.get_scores(query.lower().split())

    ranked = sorted(
        zip(documents, scores),
        key=lambda x: x[1],
        reverse=True
    )

    return [
        doc
        for doc, score in ranked[:top_k]
    ]