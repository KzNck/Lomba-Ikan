from pydantic import BaseModel
from typing import Literal


class FreshnessResult(BaseModel):
    catch_id: str
    predicted_grade: Literal["A1", "A2", "A3", "B1", "B2", "B3"]
    confidence_score: float
    hilirisasi_recommendation: str
    override_applied: bool
    rationale: str
    model_version: str