import spacy
from typing import List

nlp = spacy.load("en_core_web_sm")


def segment_clauses(text: str) -> List[str]:
    if not text or not text.strip():
        return []
    
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    clauses = []
    for line in lines:
        if len(line) < 40 and clauses:
            clauses[-1] = clauses[-1] + " " + line
        else:
            clauses.append(line)
    
    if len(clauses) <= 1:
        doc = nlp(text)
        clauses = [sent.text.strip() for sent in doc.sents if len(sent.text.strip()) > 30]
    
    return clauses