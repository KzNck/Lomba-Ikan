"""
Guardrail pasca-prediksi, 3 lapis berurutan — PERSIS dari notebook (Cell 12).
Wajib dijalankan setelah model.predict_proba(), bukan opsional.

Lapis 1: konsistensi huruf grade vs status_ikan (HIDUP->A*, MATI->B*)
Lapis 2: konsistensi dengan skor kinetika (ambang SNI 2729:2013)
Lapis 3: safety override kondisi ekstrem (>12 jam, tanpa es, suhu>=30C)
"""

import numpy as np
from app.models.kinetics import organoleptic_score_to_9scale

# Teks A1 menyimpang dari notebook: "Konsumsi lokal segar" dihapus karena grade ini estimasi indikatif, bukan
# sertifikasi mutu pangan, dan produk tidak menyarankan jalur konsumsi (fisherman-design/designv2.md §0.6).
HILIRISASI_MAP = {
    "A1": "Pelepasan kembali / silase segar (ikan masih vital, kualitas prima).",
    "A2": "Bahan pakan basah / silase segar (vitalitas menurun, tidak layak konsumsi langsung).",
    "A3": "Silase segar darurat / pakan basah kualitas rendah (vitalitas sangat rendah, hampir mati).",
    "B1": "Silase ikan / bahan baku tepung ikan mikro (dekomposisi minimal, mutu masih baik).",
    "B2": "Budidaya larva maggot BSF (dekomposisi sedang, tidak layak jadi tepung ikan).",
    "B3": "Pupuk organik cair (POC) (dekomposisi lanjut, hanya layak sebagai bahan pupuk).",
}

_GRADE_TIER = {"A1": 1, "A2": 2, "A3": 3, "B1": 1, "B2": 2, "B3": 3}


def rule_based_sanity_check(status_ikan: str, predicted_grade: str, form_data: dict):
    """Return (final_grade, override_applied, rationale)."""
    hours = form_data.get("hours_post_haul", 0)
    ice_ratio = form_data.get("ice_to_fish_ratio", 0)
    temp = form_data.get("ambient_temp_celsius", 25)
    storage = form_data.get("storage_method", "ambient")

    letter_target = "A" if status_ikan == "HIDUP" else "B"
    grade = predicted_grade
    override_applied = False
    reasons = []

    # --- Lapis 1: konsistensi huruf grade vs status hidup/mati ---
    if grade[0] != letter_target:
        tier = _GRADE_TIER[grade]
        corrected = f"{letter_target}{tier}"
        reasons.append(
            f"Model memprediksi {grade} tetapi status_ikan='{status_ikan}' mensyaratkan huruf "
            f"'{letter_target}'; grade dikoreksi ke {corrected} (tier keparahan {tier} dipertahankan)."
        )
        grade = corrected
        override_applied = True

    # --- Lapis 2: konsistensi dengan skor kinetika (ambang SNI) ---
    expected_score = organoleptic_score_to_9scale(hours, temp, ice_ratio, storage, rng=None)
    expected_tier = 1 if expected_score >= 7.0 else (2 if expected_score >= 5.0 else 3)
    current_tier = _GRADE_TIER[grade]
    if expected_tier > current_tier:
        corrected = f"{letter_target}{expected_tier}"
        reasons.append(
            f"Berdasarkan hours_post_haul={hours:.1f} jam, ambient_temp_celsius={temp:.1f}°C, "
            f"ice_to_fish_ratio={ice_ratio:.2f}, storage_method={storage}, model kinetika "
            f"memperkirakan skor organoleptik ~{expected_score:.1f}/9 (tier {expected_tier}) -- "
            f"lebih rendah dari prediksi model ({grade}, tier {current_tier}); grade diturunkan ke {corrected}."
        )
        grade = corrected
        override_applied = True

    # --- Lapis 3: safety override kondisi ekstrem ---
    if hours > 12 and ice_ratio < 0.1 and temp >= 30:
        if _GRADE_TIER[grade] != 3:
            corrected = f"{letter_target}3"
            reasons.append(
                f"SAFETY OVERRIDE: hours_post_haul={hours:.1f} jam (>12) TANPA es memadai "
                f"(ice_to_fish_ratio={ice_ratio:.2f} < 0.1) pada suhu tinggi ({temp:.1f}°C >= 30) -- "
                f"kondisi risiko tinggi menurut batas keamanan mutu SNI; grade dipaksa ke {corrected} "
                f"terlepas dari hasil model/kinetika."
            )
            grade = corrected
            override_applied = True

    rationale = " ".join(reasons) if reasons else None
    return grade, override_applied, rationale