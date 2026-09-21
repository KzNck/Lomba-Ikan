"""
Ekstraksi fitur visual dari foto ikan — VERSI YOLOv8-cls.

Menggantikan classical CV (RGB/HSV color moments + Laplacian texture) dengan
YOLOv8n-cls (binary classifier fresh/non-fresh, transfer learning ImageNet).
HARUS identik dengan extract_visual_features di notebook (Cell 12): panggil
model.predict(source=image) lalu ambil p_fresh/p_nonfresh/top1_conf dari
result.probs — kalau logic di sini menyimpang dari notebook, hasil prediksi
model unified akan salah karena dilatih dengan fitur dari fungsi persis ini.
"""

import numpy as np
from PIL import Image
from ultralytics import YOLO

FEATURE_NAMES = ["yolo_p_fresh", "yolo_p_nonfresh", "yolo_top1_conf"]


def extract_visual_features(image: Image.Image, yolo_model: YOLO) -> dict:
    """Jalankan YOLOv8-cls terlatih di atas satu foto, kembalikan probabilitas
    kelas (fresh/non-fresh) + confidence top-1 sebagai fitur visual.

    image: PIL.Image.Image -- ultralytics menerima ini langsung, tidak perlu
    konversi manual (resize/normalize ditangani otomatis oleh Ultralytics,
    identik dengan preprocessing saat training).
    """
    result = yolo_model.predict(source=image, verbose=False)[0]
    probs = result.probs  # objek Probs: .data (tensor semua kelas), .top1, .top1conf
    class_names = result.names  # mis. {0: 'fresh', 1: 'nonfresh'}, urutan mengikuti folder training

    prob_by_name = {class_names[k]: float(probs.data[k]) for k in range(len(class_names))}
    p_fresh = prob_by_name.get("fresh", 0.0)
    p_nonfresh = prob_by_name.get("nonfresh", 0.0)

    return {
        "yolo_p_fresh": p_fresh,
        "yolo_p_nonfresh": p_nonfresh,
        "yolo_top1_conf": float(probs.top1conf),
    }


def extract_visual_features_vector(image: Image.Image, yolo_model: YOLO) -> np.ndarray:
    feats = extract_visual_features(image, yolo_model)
    return np.array([feats[k] for k in FEATURE_NAMES], dtype=np.float32)