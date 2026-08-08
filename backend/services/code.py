import json
import re
from services.llm import client


SYSTEM_PROMPT = """
You are Lumina AI's code generation engine.

The user wants CODE.

Return ONLY valid JSON.

Required structure:

{
  "project": "Project Name",
  "files": [
    {
      "name": "filename",
      "language": "language",
      "code": "complete source code"
    }
  ],
  "explanation": "short explanation",
  "run": [
    "command"
  ]
}

IMPORTANT:

1. Every requested project must contain separate files.

2. HTML:
   index.html
   style.css
   script.js

3. Flutter:
   lib/main.dart and any other required files.

4. React:
   Return separate React files.

5. Python:
   Return separate .py files.

6. Java:
   Return separate .java files.

7. C++:
   Return separate .cpp files.

8. FastAPI:
   Return the required Python files separately.

9. MERN:
   Return frontend and backend files separately.

10. Every file must contain complete code.

11. Do not return markdown.

12. Do not use ```.

13. Do not put explanations outside JSON.

14. The code must be inside the "code" property of each file.
"""


def clean_response(text: str):
    """
    Remove markdown fences and surrounding text.
    """

    text = text.strip()

    # Remove markdown code fences
    text = re.sub(
        r"^```(?:json)?",
        "",
        text,
        flags=re.IGNORECASE
    )

    text = re.sub(
        r"```$",
        "",
        text
    )

    text = text.strip()

    # Find first JSON object
    start = text.find("{")

    # Find last JSON object
    end = text.rfind("}")

    if start == -1 or end == -1:
        raise ValueError(
            "No JSON object found in Gemini response"
        )

    return text[start:end + 1]


def repair_json(text: str):
    """
    Attempts to repair malformed JSON caused by
    raw newlines/tabs inside JSON string values.
    """

    result = []

    inside_string = False
    escaped = False

    for char in text:

        if char == '"' and not escaped:
            inside_string = not inside_string

        if inside_string:

            if char == "\n":
                result.append("\\n")
                escaped = False
                continue

            if char == "\r":
                result.append("\\r")
                escaped = False
                continue

            if char == "\t":
                result.append("\\t")
                escaped = False
                continue

        result.append(char)

        if char == "\\" and not escaped:
            escaped = True
        else:
            escaped = False

    return "".join(result)


def parse_json(text: str):

    cleaned = clean_response(text)

    # First attempt: normal JSON
    try:
        return json.loads(cleaned)

    except json.JSONDecodeError as first_error:

        print(
            "Normal JSON parsing failed."
        )

        print(
            "Attempting JSON repair..."
        )

        # Second attempt: repair raw newlines
        repaired = repair_json(cleaned)

        try:
            return json.loads(repaired)

        except json.JSONDecodeError:

            print(
                "JSON repair failed."
            )

            raise first_error


def normalize_files(data):

    files = []

    for file in data.get("files", []):

        filename = (
            file.get("name")
            or file.get("filename")
            or ""
        ).strip()

        language = (
            file.get("language")
            or "text"
        ).strip()

        code = (
            file.get("code")
            or file.get("content")
            or ""
        )

        if not filename:
            continue

        files.append({
            "name": filename,
            "language": language,
            "code": code,
        })

    return files


def generate_code(question: str):

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=f"""
{SYSTEM_PROMPT}

USER REQUEST:

{question}
"""
    )

    text = response.text.strip()

    print("\n========== CODE GENERATOR ==========")
    print(text)
    print("====================================\n")

    try:

        data = parse_json(text)

        files = normalize_files(data)

        # Make sure we actually received files
        if not files:

            raise ValueError(
                "Gemini returned no files"
            )

        result = {
            "project": data.get(
                "project",
                "Generated Project"
            ),

            "files": files,

            "explanation": data.get(
                "explanation",
                ""
            ),

            "run": data.get(
                "run",
                []
            ),
        }

        print(
            "✅ Code successfully parsed"
        )

        print(
            "Files:",
            [file["name"] for file in files]
        )

        return result

    except Exception as error:

        print(
            "❌ Code response parsing failed:",
            error
        )

        # IMPORTANT:
        # Do NOT return the whole response as output.txt.
        # Instead return a useful error response.

        return {
            "project": "Code Generation",
            "files": [],
            "explanation": (
                "The AI generated the code, but the "
                "structured response could not be parsed. "
                "Please try generating the code again."
            ),
            "run": [],
        }