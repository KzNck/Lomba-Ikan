"""
Freshness predictor — VERSI YOLO-UNIFIED (RandomForest 6-kelas, fusion YOLOv8-cls+tabular).

Load bycatch_unified_model.joblib + bycatch_preprocessor.joblib + bycatch_yolo_freshness.pt
sekali saat startup, reuse tiap request. Ikuti persis alur evaluate_bycatch() di notebook
IniiKAN_YOLO_unified.ipynb (Cell 12-13). Tahap fitur visual sudah diganti dari classical CV
ke YOLOv8n-cls (lihat visual_features.py) -- bycatch_unified_model.joblib & preprocessor
di sini WAJIB dari export notebook yang sama; model lama (classical-CV) TIDAK kompatibel
karena beda jumlah fitur.
"""

import os
import joblib
import numpy as np
import pandas as pd
from PIL import Image
from ultralytics import YOLO

from app.models.visual_features import extract_visual_features_vector
from app.models.guardrail import rule_based_sanity_check, HILIRISASI_MAP

MODEL_VERSION = "bycatch-unified-rf-yolo-v2"

NUMERIC_COLS = ["hours_post_haul", "ice_to_fish_ratio", "ambient_temp_celsius"]
CATEGORICAL_COLS = ["storage_method", "fish_category", "status_awal"]

MODEL_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(MODEL_DIR, "bycatch_unified_model.joblib")
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, "bycatch_preprocessor.joblib")
YOLO_MODEL_PATH = os.path.join(MODEL_DIR, "bycatch_yolo_freshness.pt")


class FreshnessPredictor:
    def __init__(self):
        missing = [
            p for p in (MODEL_PATH, PREPROCESSOR_PATH, YOLO_MODEL_PATH) if not os.path.exists(p)
        ]
        if missing:
            raise FileNotFoundError(
                f"File model tidak ditemukan: {missing}. Pastikan bycatch_unified_model.joblib, "
                f"bycatch_preprocessor.joblib, dan bycatch_yolo_freshness.pt ada di {MODEL_DIR}"
            )
        self.model = joblib.load(MODEL_PATH)
        self.preprocessor = joblib.load(PREPROCESSOR_PATH)
        self.yolo_model = YOLO(YOLO_MODEL_PATH)

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

        visual_feats = extract_visual_features_vector(image, self.yolo_model).reshape(1, -1)
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