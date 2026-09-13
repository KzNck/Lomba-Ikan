from fastapi import APIRouter, HTTPException
from app.models.schemas import CatchInput, FreshnessResult
from app.models.predictor import predictor, PredictionInput
import logging

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Freshness"])


@router.post("/predict", response_model=FreshnessResult)
def predict_freshness(payload: CatchInput):
    """
    Terima data tangkapan → return freshness grade A/B/C.
    Dipanggil oleh Supabase Edge Function setelah catch di-sync.
    """
    try:
        result = predictor.predict(
            PredictionInput(
                species=payload.species,
                weight_kg=payload.weight_kg,
                catch_time=payload.catch_time,
                storage_method=payload.storage_method,
                vessel_condition=payload.vessel_condition,
            )
        )
        return FreshnessResult(catch_id=payload.catch_id, **result)

    except Exception as e:
        logger.error(f"Prediction error for catch {payload.catch_id}: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")