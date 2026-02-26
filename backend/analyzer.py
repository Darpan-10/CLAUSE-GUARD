import os
import json
import time
from google import genai
from dotenv import load_dotenv
from config import GEMINI_MODEL
from utils import clean_markdown_json, safe_json_load, normalize_keys


load_dotenv()

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])


def analyze_clause(clause: str, contract_type: str, max_retries: int = 3) -> dict:
    prompt = f"""You are a senior legal risk analyst specializing in contract law.
Analyze the following clause from a {contract_type}.
Return ONLY a JSON object. No explanation. No markdown. No extra text.

Clause:
\"\"\"{clause}\"\"\"

Return ONLY this JSON:
{{
 "risk_score": <integer 0-100>,
  "risk_level": "<Low|Medium|High|Critical>",
  "risk_category": "<Financial|Legal|Compliance|Enforceability|Termination>"
}}"""

    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt
            )
            raw = response.text.strip()
            cleaned = clean_markdown_json(raw)
            result = safe_json_load(cleaned)

            normalized = normalize_keys(result)
            
            return {
                "risk_score": int(normalized.get("risk_score", 0)),
                "risk_level": str(normalized.get("risk_level", "Unknown")),
                "risk_category": str(normalized.get("risk_category", "Unknown"))
            }
        except Exception as e:
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                if attempt < max_retries - 1:
                    wait_time = (attempt + 1) * 2  # Exponential backoff
                    print(f"Rate limit hit. Retrying in {wait_time}s... (Attempt {attempt + 1}/{max_retries})")
                    time.sleep(wait_time)
                    continue
            print(f"Error in Gemini analysis: {e}")
            return {"risk_score": 0, "risk_level": "Error", "risk_category": "Unknown"}
    
    return {"risk_score": 0, "risk_level": "Error", "risk_category": "Unknown"}


def generate_summary(full_text: str, max_retries: int = 3) -> dict:
    truncated_text = full_text[:4000]
    
    prompt = f"""You are a senior legal analyst.
Summarize the following contract in plain English.
Return ONLY valid JSON in this exact format:
{{
  "summary_points": ["5-8 clear bullet points"],
  "what_you_are_agreeing_to": "short paragraph summary",
  "key_facts": {{
     "duration": "if mentioned, otherwise 'Not specified'",
     "payment_terms": "if mentioned, otherwise 'Not specified'",
     "termination_notice": "if mentioned, otherwise 'Not specified'",
     "governing_law": "if mentioned, otherwise 'Not specified'"
  }}
}}
No markdown.
No explanation outside JSON.

Contract text:
{truncated_text}"""
    
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt
            )
            cleaned_text = clean_markdown_json(response.text)
            return normalize_keys(safe_json_load(cleaned_text))
        except Exception as e:
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                if attempt < max_retries - 1:
                    wait_time = (attempt + 1) * 5  # Longer backoff for summary
                    print(f"Rate limit hit during summary. Retrying in {wait_time}s... (Attempt {attempt + 1}/{max_retries})")
                    time.sleep(wait_time)
                    continue
            print(f"Error generating summary: {e}")
            return {
                "summary_points": ["Could not generate summary points"],
                "what_you_are_agreeing_to": "Summary generation failed.",
                "key_facts": {
                    "duration": "Error",
                    "payment_terms": "Error",
                    "termination_notice": "Error",
                    "governing_law": "Error"
                }
            }
    
    return {
        "summary_points": ["Could not generate summary points"],
        "what_you_are_agreeing_to": "Summary generation failed.",
        "key_facts": {
            "duration": "Error",
            "payment_terms": "Error",
            "termination_notice": "Error",
            "governing_law": "Error"
        }
    }
