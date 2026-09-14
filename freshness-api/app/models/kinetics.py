"""
Model kinetika organoleptik — dipakai HANYA untuk guardrail (Lapis 2 & 3),
bukan untuk prediksi utama. Persis dari notebook training (Cell 2 & 3).

Konstanta Q10_ASSUMED, T_REF_CALIBRATED, K_BASE_CALIBRATED sudah dihitung
sekali di notebook lewat curve_fit terhadap data riil (ikan nila, suhu ruang).
Nilai hasil fit di-hardcode di sini supaya tidak perlu scipy.optimize di runtime.
"""

import numpy as np

# Hasil curve_fit dari notebook (Cell 3) — JANGAN ubah kecuali model di-retrain.
Q10_ASSUMED = 2.0
T_REF_CALIBRATED = 30.0
K_BASE_CALIBRATED = 0.3383  # dihitung dari _decay_rate_at_ref * _ice_protection_calib

STORAGE_QUALITY = {"crushed_ice": 1.0, "chilled_seawater": 0.75, "ambient": 0.15}


def organoleptic_score_to_9scale(
    hours: float,
    ambient_temp: float,
    ice_ratio: float,
    storage_method: str,
    rng: np.random.Generator | None = None,
) -> float:
    """Skor organoleptik 1-9 (skala SNI 01-2346-2006), meluruh dari basis 9
    mengikuti kinetika waktu-suhu Arrhenius/Q10, dimoderasi rasio es & metode simpan.

    Untuk guardrail (bukan generate data training), panggil TANPA rng supaya
    deterministik (tidak ada noise acak) — lihat pemakaian di predictor.py.
    """
    storage_q = STORAGE_QUALITY.get(storage_method, STORAGE_QUALITY["ambient"])
    ice_protection = 0.15 + 0.85 * (0.5 * ice_ratio + 0.5 * storage_q)

    q10_multiplier = Q10_ASSUMED ** ((ambient_temp - T_REF_CALIBRATED) / 10.0)
    decay_rate = K_BASE_CALIBRATED * q10_multiplier / max(ice_protection, 0.1)

    score = 9.0 * np.exp(-decay_rate * hours / 9.0)

    if rng is not None:
        noise = rng.normal(0, 0.35)
        score += noise

    return float(np.clip(score, 1.0, 9.0))