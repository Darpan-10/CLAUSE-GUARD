from transformers import pipeline
from typing import Tuple

# Load classifier once globally
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

CANDIDATE_LABELS = [
   "Non-Disclosure Agreement",
 "Employment Agreement",
 "Service Agreement",
 "Partnership Agreement",
 "Governance Agreement",
 "Multi-Party Agreement",
 "Financial Agreement",
 "Administrative Agreement"
]


def detect_contract_type(text: str) -> Tuple[str, float]:
    sample = text[:1000]
    result = classifier(sample, CANDIDATE_LABELS)
    label = result["labels"][0]
    score = result["scores"][0]

    if score < 0.60:
        return ("General Contract", score)

    return (label, score)