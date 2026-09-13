"""
Freshness predictor — rule-based dulu, siap di-swap ke ML model.

Untuk swap ke ML:
1. Load model.pkl di __init__
2. Ganti metode predict() pakai model.predict(features)
3. API contract (input/output) tidak berubah sama sekali
"""

from datetime import datetime, timezone
from dataclasses import dataclass

MODEL_VERSION = "rule-based-v1"


@dataclass
class PredictionInput:
    species: str
    weight_kg: float
    catch_time: datetime
    storage_method: str
    vessel_condition: str | None


class FreshnessPredictor:
    # Penalti per jam berdasarkan metode penyimpanan
    STORAGE_DECAY = {
        "es_balok": 1.8,    # paling lambat busuk
        "es_curah": 2.5,
        "tanpa_es": 5.0,    # paling cepat busuk
    }

    # Bonus/penalti species (ikan kecil lebih cepat turun kualitas)
    SPECIES_FACTOR = {
        "tongkol": 1.0,
        "kakap": 0.9,       # lebih tahan
        "kembung": 1.2,     # lebih cepat turun
        "tenggiri": 0.95,
        "cakalang": 1.0,
    }

    VESSEL_PENALTY = {
        "baik": 0,
        "cukup": 5,
        "buruk": 15,
    }

    def predict(self, data: PredictionInput) -> dict:
        now = datetime.now(timezone.utc)

        # Pastikan catch_time timezone-aware
        catch_time = data.catch_time
        if catch_time.tzinfo is None:
            catch_time = catch_time.replace(tzinfo=timezone.utc)

        hours = max(0, (now - catch_time).total_seconds() / 3600)

        # Hitung decay rate
        decay_rate = self.STORAGE_DECAY.get(data.storage_method, 3.0)
        species_factor = self.SPECIES_FACTOR.get(data.species.lower(), 1.0)
        vessel_penalty = self.VESSEL_PENALTY.get(data.vessel_condition or "baik", 0)

        # Skor awal 100, turun berdasarkan jam + faktor
        score = 100.0
        score -= hours * decay_rate * species_factor
        score -= vessel_penalty
        score = max(0.0, min(100.0, score))

        # Grade mapping
        if score >= 75:
            grade = "A"
            notes = f"Sangat segar. {hours:.1f} jam sejak tangkap dengan penyimpanan {data.storage_method}."
        elif score >= 50:
            grade = "B"
            notes = f"Masih layak jual. Direkomendasikan segera diproses dalam 12 jam ke depan."
        else:
            grade = "C"
            notes = f"Kualitas menurun. {hours:.1f} jam sejak tangkap. Pertimbangkan pengolahan segera."

        return {
            "grade": grade,
            "score": round(score, 2),
            "notes": notes,
            "model_version": MODEL_VERSION,
            "hours_since_catch": round(hours, 2),
        }


# Singleton — load sekali, reuse tiap request
predictor = FreshnessPredictor()