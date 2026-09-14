FROM python:3.11-slim

RUN useradd -m appuser
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/

# File model — WAJIB ada di folder ini sebelum build (lihat README.md)
COPY bycatch_unified_model.joblib .
COPY bycatch_preprocessor.joblib .

USER appuser

ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]