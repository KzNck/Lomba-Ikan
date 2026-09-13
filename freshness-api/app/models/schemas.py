from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class CatchInput(BaseModel):
    catch_id: str = Field(..., description="UUID catch dari Supabase")
    species: str = Field(..., description="Jenis ikan, e.g. 'tongkol', 'kakap'")
    weight_kg: float = Field(..., gt=0)
    catch_time: datetime = Field(..., description="Waktu tangkap (ISO 8601)")
    storage_method: str = Field(..., description="'es_balok' | 'es_curah' | 'tanpa_es'")
    vessel_condition: Optional[str] = Field(None, description="'baik' | 'cukup' | 'buruk'")

    model_config = {
        "json_schema_extra": {
            "example": {
                "catch_id": "uuid-dari-supabase",
                "species": "tongkol",
                "weight_kg": 50.0,
                "catch_time": "2026-09-11T06:00:00Z",
                "storage_method": "es_balok",
                "vessel_condition": "baik",
            }
        }
    }


class FreshnessResult(BaseModel):
    catch_id: str
    grade: str = Field(..., description="'A' | 'B' | 'C'")
    score: float = Field(..., ge=0, le=100)
    notes: str
    model_version: str
    hours_since_catch: float