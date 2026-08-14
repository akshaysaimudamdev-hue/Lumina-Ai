import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def create_embeddings(chunks):
    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=chunks
    )

    return [embedding.values for embedding in response.embeddings]
