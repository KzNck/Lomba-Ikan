FROM python:3.11-slim

RUN useradd -m appuser
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/

# File model — WAJIB ada di folder ini sebelum build.
# bycatch_unified_model.joblib & bycatch_preprocessor.joblib di sini HARUS versi
# YOLO-unified (dari backend_artifacts.zip notebook IniiKAN_YOLO_unified.ipynb),
# bukan versi classical-CV lama -- beda jumlah fitur, tidak kompatibel.
COPY bycatch_unified_model.joblib .
COPY bycatch_preprocessor.joblib .
COPY bycatch_yolo_freshness.pt .

USER appuser

ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]