import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

for model in client.models.list():
    print(model.name)

print("\n------ Generation Models ------\n")

for model in client.models.list():
    if "generateContent" in model.supported_actions:
        print(model.name)