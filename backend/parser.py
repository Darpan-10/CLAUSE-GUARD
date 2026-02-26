import io
import fitz  # PyMuPDF
import spacy
from docx import Document
from fastapi import UploadFile
from typing import List

# Load spaCy model once globally
nlp = spacy.load("en_core_web_sm")


async def extract_text(file: UploadFile) -> str:
    contents = await file.read()

    if file.content_type == "application/pdf":
        pdf_doc = fitz.open(stream=contents, filetype="pdf")
        text = ""
        for page in pdf_doc:
            text += page.get_text()
        pdf_doc.close()
        return text

    elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        docx_doc = Document(io.BytesIO(contents))
        text = "\n".join([para.text for para in docx_doc.paragraphs])
        return text

    else:
        raise ValueError(f"Unsupported file format: {file.content_type}")


def segment_clauses(text: str) -> List[str]:
    # Primary: newline-based structural splitting
    lines = [line.strip() for line in text.split("\n") if len(line.strip()) >= 30]

    if lines:
        return lines

    # Fallback: spaCy sentence splitting
    doc = nlp(text)
    clauses = [sent.text.strip() for sent in doc.sents if len(sent.text.strip()) >= 30]

    return clauses