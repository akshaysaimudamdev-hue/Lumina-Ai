import re

user_profile = {
    "name": None
}


def detect_name(text):

    patterns = [
        
    r"my name is\s+(.+)",
    r"i am\s+(.+)",
    r"i'm\s+(.+)",
    r"call me\s+(.+)",
    r"you can call me\s+(.+)",
    r"this is\s+(.+)",
    r"myself\s+(.+)"
]
    

    text = text.lower()

    for pattern in patterns:
        match = re.search(pattern, text)

        if match:
            name = match.group(1).strip().title()
            user_profile["name"] = name
            return name

    return None


def get_name():
    return user_profile["name"]