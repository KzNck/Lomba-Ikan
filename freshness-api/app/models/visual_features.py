"""
Ekstraksi fitur visual dari foto ikan — HARUS identik dengan extract_visual_features
di notebook training (Cell 10), kalau tidak, hasil prediksi akan salah karena
model dilatih dengan fitur dari fungsi persis ini.
"""

import numpy as np
from PIL import Image
from scipy import ndimage

FEATURE_NAMES = [
    "rgb_r_mean", "rgb_g_mean", "rgb_b_mean", "rgb_r_std", "rgb_g_std", "rgb_b_std",
    "hsv_h_mean", "hsv_s_mean", "hsv_v_mean", "hsv_s_std", "hsv_v_std",
    "brightness_mean", "redness_ratio", "texture_laplacian_var", "contrast_std",
]


def extract_visual_features(image: Image.Image, size: int = 128) -> dict:
    """Fitur visual classical (RGB/HSV color moments + tekstur Laplacian), dihitung
    global atas seluruh citra — persis seperti notebook, bukan potongan posisi tetap."""
    img = image.convert("RGB").resize((size, size))
    arr = np.asarray(img).astype(np.float32) / 255.0  # (H, W, 3) RGB 0-1

    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    hsv = np.asarray(img.convert("HSV")).astype(np.float32) / 255.0
    h_ch, s_ch, v_ch = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    gray = arr.mean(axis=2)

    feats = {
        "rgb_r_mean": float(r.mean()), "rgb_g_mean": float(g.mean()), "rgb_b_mean": float(b.mean()),
        "rgb_r_std": float(r.std()), "rgb_g_std": float(g.std()), "rgb_b_std": float(b.std()),
        "hsv_h_mean": float(h_ch.mean()), "hsv_s_mean": float(s_ch.mean()), "hsv_v_mean": float(v_ch.mean()),
        "hsv_s_std": float(s_ch.std()), "hsv_v_std": float(v_ch.std()),
        "brightness_mean": float(gray.mean()),
        "redness_ratio": float(r.mean() / (g.mean() + b.mean() + 1e-6)),
        "texture_laplacian_var": float(ndimage.laplace(gray).var()),
        "contrast_std": float(gray.std()),
    }
    return feats


def extract_visual_features_vector(image: Image.Image) -> np.ndarray:
    feats = extract_visual_features(image)
    return np.array([feats[k] for k in FEATURE_NAMES], dtype=np.float32)