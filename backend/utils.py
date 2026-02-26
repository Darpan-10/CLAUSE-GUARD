import json


def clean_markdown_json(raw_text: str) -> str:
    text = raw_text.strip()
    text = text.replace("```json", "").replace("```", "").strip()
    return text


def safe_json_load(raw_text: str) -> dict:
    try:
        return json.loads(raw_text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON: {str(e)}")


def normalize_keys(data: dict) -> dict:
    return {key.lower(): value for key, value in data.items()}