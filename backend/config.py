import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY environment variable is not set")

GEMINI_MODEL = "gemini-2.0-flash"
MAX_CLAUSES = 20
MAX_INPUT_CHARS = 4000
CLASSIFIER_MODEL = "facebook/bart-large-mnli"