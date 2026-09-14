"""
Freshness predictor — VERSI MODEL ASLI (RandomForest 6-kelas, fusion visual+tabular).

Load bycatch_unified_model.joblib + bycatch_preprocessor.joblib sekali saat startup,
reuse tiap request. Ikuti persis alur evaluate_bycatch() di notebook (Cell 12).
"""

import os
import joblib
import numpy as np
import pandas as pd
from PIL import Image

from app.models.visual_features import extract_visual_features_vector
from app.models.guardrail import rule_based_sanity_check, HILIRISASI_MAP

MODEL_VERSION = "bycatch-unified-rf-v1"

NUMERIC_COLS = ["hours_post_haul", "ice_to_fish_ratio", "ambient_temp_celsius"]
CATEGORICAL_COLS = ["storage_method", "fish_category", "status_awal"]

MODEL_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(MODEL_DIR, "bycatch_unified_model.joblib")
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, "bycatch_preprocessor.joblib")


class FreshnessPredictor:
    def __init__(self):
        if not os.path.exists(MODEL_PATH) or not os.path.exists(PREPROCESSOR_PATH):
            raise FileNotFoundError(
                f"Model atau preprocessor tidak ditemukan. Pastikan "
                f"bycatch_unified_model.joblib dan bycatch_preprocessor.joblib "
                f"ada di {MODEL_DIR}"
            )
        self.model = joblib.load(MODEL_PATH)
        self.preprocessor = joblib.load(PREPROCESSOR_PATH)

    def predict(self, image: Image.Image, form_data: dict) -> dict:
        """
        form_data wajib berisi:
          - status_ikan: 'HIDUP' | 'MATI'
          - hours_post_haul: float
          - ice_to_fish_ratio: float
          - ambient_temp_celsius: float
          - storage_method: 'crushed_ice' | 'chilled_seawater' | 'ambient'
          - fish_category: 'campuran' | 'teri_non_grade' | 'rucah'
        """
        status_ikan = form_data.get("status_ikan")
        if status_ikan not in ("HIDUP", "MATI"):
            raise ValueError("form_data['status_ikan'] harus 'HIDUP' atau 'MATI'")

        required = [
            "hours_post_haul", "ice_to_fish_ratio", "ambient_temp_celsius",
            "storage_method", "fish_category",
        ]
        missing = [k for k in required if k not in form_data]
        if missing:
            raise ValueError(f"form_data kekurangan field: {missing}")

        # Build tabular row — nama kolom internal "status_awal" (sesuai training)
        tab_row = pd.DataFrame([{
            "hours_post_haul": form_data["hours_post_haul"],
            "ice_to_fish_ratio": form_data["ice_to_fish_ratio"],
            "ambient_temp_celsius": form_data["ambient_temp_celsius"],
            "storage_method": form_data["storage_method"],
            "fish_category": form_data["fish_category"],
            "status_awal": status_ikan,
        }])[NUMERIC_COLS + CATEGORICAL_COLS]

        tab_feats = self.preprocessor.transform(tab_row)
        if hasattr(tab_feats, "toarray"):
            tab_feats = tab_feats.toarray()

        visual_feats = extract_visual_features_vector(image).reshape(1, -1)
        X = np.hstack([tab_feats, visual_feats]).astype(np.float32)

        probs = self.model.predict_proba(X)[0]
        classes = self.model.classes_
        pred_idx = int(np.argmax(probs))
        predicted_grade_raw = str(classes[pred_idx])
        confidence = float(probs[pred_idx])

        final_grade, override_applied, override_reason = rule_based_sanity_check(
            status_ikan, predicted_grade_raw, form_data
        )

        if override_applied:
            rationale = override_reason
        else:
            rationale = (
                f"Prediksi model unified (fitur visual+tabular, Random Forest 6-kelas) untuk grade "
                f"{final_grade} dengan confidence {confidence:.2f}, konsisten dengan status_ikan="
                f"{status_ikan}, hours_post_haul={form_data['hours_post_haul']}, "
                f"ice_to_fish_ratio={form_data['ice_to_fish_ratio']}, "
                f"ambient_temp_celsius={form_data['ambient_temp_celsius']}, "
                f"storage_method={form_data['storage_method']}."
            )

        return {
            "predicted_grade": final_grade,
            "confidence_score": round(confidence, 4),
            "hilirisasi_recommendation": HILIRISASI_MAP[final_grade],
            "override_applied": override_applied,
            "rationale": rationale,
            "model_version": MODEL_VERSION,
        }


# Singleton — load sekali saat container start, reuse tiap request
predictor = FreshnessPredictor()