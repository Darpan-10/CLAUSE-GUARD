from typing import List


def calculate_overall(clauses: List[dict]) -> dict:
    if not clauses:
        return {
            "overall_risk_score": 0,
            "risk_dimensions": {
                "Financial": 0,
                "Legal": 0,
                "Compliance": 0,
                "Enforceability": 0,
                "Termination": 0
            }
        }

    total = sum(clause.get("risk_score", 0) for clause in clauses)
    overall_risk_score = round(total / len(clauses), 2)

    categories = ["Financial", "Legal", "Compliance", "Enforceability", "Termination"]
    risk_dimensions = {}

    for category in categories:
        category_clauses = [c for c in clauses if c.get("risk_category") == category]
        if category_clauses:
            category_total = sum(c.get("risk_score", 0) for c in category_clauses)
            risk_dimensions[category] = round(category_total / len(category_clauses), 2)
        else:
            risk_dimensions[category] = 0

    return {
        "overall_risk_score": overall_risk_score,
        "risk_dimensions": risk_dimensions
    }