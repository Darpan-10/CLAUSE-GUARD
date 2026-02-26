from typing import List
from pydantic import BaseModel


class ClauseModel(BaseModel):
    clause_text: str
    risk_score: int
    risk_level: str
    risk_category: str


class RiskDimensionsModel(BaseModel):
    Financial: float
    Legal: float
    Compliance: float
    Enforceability: float
    Termination: float
    
class SummaryModel(BaseModel):
    summary_points: List[str]
    what_you_are_agreeing_to: str
    key_facts: dict

class AnalysisResponseModel(BaseModel):
    contract_type: str
    confidence: float
    overall_risk_score: float
    risk_dimensions: RiskDimensionsModel
    clauses: List[ClauseModel]
    summary: SummaryModel

