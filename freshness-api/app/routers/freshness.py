from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from PIL import Image, UnidentifiedImageError
from pillow_heif import register_heif_opener
import io
import logging

# Foto dari iPhone/Mac defaultnya HEIC, yang tidak bisa dibuka Pillow sendiri.
register_heif_opener()

from app.models.predictor import predictor
from app.models.schemas import FreshnessResult

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Freshness"])


@router.post("/predict", response_model=FreshnessResult)
async def predict_freshness(
    catch_id: str = Form(...),
    status_ikan: str = Form(..., description="'HIDUP' atau 'MATI'"),
    hours_post_haul: float = Form(...),
    ice_to_fish_ratio: float = Form(...),
    ambient_temp_celsius: float = Form(...),
    storage_method: str = Form(..., description="'crushed_ice' | 'chilled_seawater' | 'ambient'"),
    fish_category: str = Form(..., description="'campuran' | 'teri_non_grade' | 'rucah'"),
    photo: UploadFile = File(..., description="Foto ikan (jpg/png)"),
):
    """
    Terima foto ikan + data form → return grade A1/A2/A3/B1/B2/B3.
    Dipanggil sebagai multipart/form-data (bukan JSON) karena ada file upload.
    """
    try:
        # Validasi status_ikan sebelum masuk predictor (biar error lebih jelas)
        if status_ikan not in ("HIDUP", "MATI"):
            raise HTTPException(status_code=422, detail="status_ikan harus 'HIDUP' atau 'MATI'")

        # Baca file foto jadi PIL Image
        photo_bytes = await photo.read()
        try:
            image = Image.open(io.BytesIO(photo_bytes))
            image.load()
        except UnidentifiedImageError:
            raise HTTPException(status_code=422, detail="Format foto tidak dikenali. Gunakan JPG, PNG, WebP, atau HEIC.")

        form_data = {
            "status_ikan": status_ikan,
            "hours_post_haul": hours_post_haul,
            "ice_to_fish_ratio": ice_to_fish_ratio,
            "ambient_temp_celsius": ambient_temp_celsius,
            "storage_method": storage_method,
            "fish_category": fish_category,
        }

        result = predictor.predict(image, form_data)
        return FreshnessResult(catch_id=catch_id, **result)

    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction error for catch {catch_id}: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")