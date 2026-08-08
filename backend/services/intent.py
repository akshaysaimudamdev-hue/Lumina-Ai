import re


CODE_ACTIONS = {
    "build",
    "create",
    "generate",
    "write",
    "develop",
    "implement",
    "make",
    "design",
    "fix",
    "debug",
    "convert",
}

TECH_KEYWORDS = {
    "react",
    "next",
    "nextjs",
    "flutter",
    "dart",
    "html",
    "css",
    "javascript",
    "typescript",
    "python",
    "java",
    "cpp",
    "c++",
    "fastapi",
    "django",
    "flask",
    "node",
    "express",
    "mern",
    "mongodb",
    "mysql",
    "firebase",
    "tailwind",
    "bootstrap",
    "api",
    "website",
    "webpage",
    "portfolio",
    "login",
    "dashboard",
}


IMAGE_KEYWORDS = {
    "image",
    "photo",
    "picture",
    "wallpaper",
    "draw",
    "logo",
    "poster",
    "icon",
    "illustration",
}


MEMORY_KEYWORDS = {
    "remember",
    "my name is",
    "call me",
    "save my",
    "don't forget",
}


RAG_KEYWORDS = {
    "pdf",
    "document",
    "resume",
    "summarize",
    "summarise",
    "summary",
    "notes",
    "chapter",
    "unit",
}


def detect_intent(question: str):

    question = question.lower()

    words = set(re.findall(r"\b\w+\b", question))

    # ---------- Memory ----------

    if any(keyword in question for keyword in MEMORY_KEYWORDS):
        return "memory"

    # ---------- Image ----------

    if any(keyword in question for keyword in IMAGE_KEYWORDS):
        return "image"

    # ---------- RAG ----------

    if any(keyword in question for keyword in RAG_KEYWORDS):
        return "rag"

    # ---------- Code ----------

    action = any(word in words for word in CODE_ACTIONS)
    tech = any(word in words for word in TECH_KEYWORDS)

    if action and tech:
        return "code"

    return "chat"