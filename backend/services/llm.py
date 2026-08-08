import os
import time

from dotenv import load_dotenv
from google import genai
from google.genai import types


# =====================================================
# ENVIRONMENT
# =====================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing. "
        "Add it to backend/.env"
    )


# =====================================================
# GEMINI CLIENT
# =====================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# =====================================================
# MODEL
# =====================================================

MODEL_NAME = "gemini-3.5-flash"


# =====================================================
# GEMINI REQUEST
# =====================================================

def ask_gemini(
    prompt: str,
    user_context: str = "",
) -> str:

    full_prompt = f"""
You are Lumina AI, an intelligent AI assistant.

{user_context}

User request:
{prompt}

Answer clearly, accurately, and professionally.
"""

    # -------------------------------------------------
    # RETRY CONFIGURATION
    # -------------------------------------------------

    max_retries = 3

    for attempt in range(max_retries):

        try:

            print(
                f"\nSending request to Gemini "
                f"(attempt {attempt + 1}/{max_retries})..."
            )

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    temperature=0.3,
                ),
            )

            if not response or not response.text:

                return (
                    "Gemini returned an empty response. "
                    "Please try again."
                )

            return response.text.strip()

        except Exception as error:

            error_text = str(error)

            print(
                "\nGemini API error:",
                error_text
            )

            # -----------------------------------------
            # TEMPORARY SERVER / RATE LIMIT ERRORS
            # -----------------------------------------

            if (
                "503" in error_text
                or "UNAVAILABLE" in error_text
                or "429" in error_text
                or "RESOURCE_EXHAUSTED" in error_text
            ):

                if attempt < max_retries - 1:

                    wait_time = 2 ** attempt

                    print(
                        f"Gemini temporarily unavailable. "
                        f"Retrying in {wait_time} seconds..."
                    )

                    time.sleep(
                        wait_time
                    )

                    continue

                return (
                    "Gemini is temporarily unavailable. "
                    "Please try again in a few moments."
                )

            # -----------------------------------------
            # AUTHENTICATION
            # -----------------------------------------

            if (
                "API key" in error_text
                or "401" in error_text
                or "403" in error_text
            ):

                return (
                    "The Gemini API configuration is "
                    "invalid. Please check the API key."
                )

            # -----------------------------------------
            # MODEL ERROR
            # -----------------------------------------

            if "404" in error_text:

                return (
                    "The configured Gemini model is "
                    "currently unavailable. "
                    "Please update the model configuration."
                )

            # -----------------------------------------
            # UNKNOWN ERROR
            # -----------------------------------------

            return (
                "I couldn't generate a response right now. "
                "Please try again."
            )

    return (
        "I couldn't generate a response. "
        "Please try again."
    )