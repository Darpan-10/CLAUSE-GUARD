import asyncio

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from analyzer import analyze_clause, generate_summary
from aggregator import calculate_overall
from classifier import detect_contract_type
from models import AnalysisResponseModel
from parser import extract_text
from segmenter import segment_clauses

app = FastAPI(title="ClauseGuard", description="AI-powered contract risk analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "ClauseGuard"}


# Global semaphore to limit concurrent AI calls (stays within Free Tier RPM limits)
ai_semaphore = asyncio.Semaphore(2)

async def sem_analyze_clause(clause, contract_type):
    async with ai_semaphore:
        # Small delay between requests to further prevent rate limiting
        await asyncio.sleep(0.5)
        return await asyncio.to_thread(analyze_clause, clause, contract_type)

@app.post("/analyze", response_model=AnalysisResponseModel)
async def analyze_contract(file: UploadFile = File(...)):
    if file.content_type not in [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]:
        raise HTTPException(status_code=400, detail="Unsupported file type. Upload a PDF or DOCX.")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    await file.seek(0)

    try:
        text = await extract_text(file)

        if not text or not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the file.")

        contract_type, confidence = detect_contract_type(text)

        # Run summary with semaphore
        async with ai_semaphore:
            summary = await asyncio.to_thread(generate_summary, text)

        clauses = segment_clauses(text)[:20]

        if not clauses:
            raise HTTPException(status_code=400, detail="No clauses found in the document.")

        tasks = [
            sem_analyze_clause(clause, contract_type)
            for clause in clauses
        ]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        analyzed_clauses = []
        for clause, result in zip(clauses, results):
            if isinstance(result, Exception):
                print(f"Error analyzing clause: {result}")
                analyzed_clauses.append({
                    "clause_text": clause,
                    "risk_score": 0,
                    "risk_level": "Error",
                    "risk_category": "Unknown",
                })
            else:
                analyzed_clauses.append({
                    "clause_text": clause,
                    "risk_score": result.get("risk_score", 0),
                    "risk_level": result.get("risk_level", "Unknown"),
                    "risk_category": result.get("risk_category", "Unknown"),
                })

        overall = calculate_overall(analyzed_clauses)

        return AnalysisResponseModel(
            contract_type=contract_type,
            confidence=round(confidence, 4),
            overall_risk_score=overall["overall_risk_score"],
            risk_dimensions=overall["risk_dimensions"],
            clauses=analyzed_clauses,
            summary=summary,
        )

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal AI error: {str(e)}")