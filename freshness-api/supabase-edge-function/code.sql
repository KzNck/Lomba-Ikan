-- Migration: tambah kolom yang dibutuhkan model AI (bycatch_unified_model)
-- Jalankan ini SETELAH schema.sql utama, di Supabase SQL Editor.

-- freshness_grade dipakai di 2 tabel: catches.freshness_grade DAN
-- ai_inference_log.grade_result -- keduanya harus di-convert bersamaan.

ALTER TYPE freshness_grade RENAME TO freshness_grade_old;

CREATE TYPE freshness_grade AS ENUM ('A1', 'A2', 'A3', 'B1', 'B2', 'B3');

-- Convert catches.freshness_grade
ALTER TABLE public.catches
  ALTER COLUMN freshness_grade DROP DEFAULT,
  ALTER COLUMN freshness_grade TYPE freshness_grade
    USING NULL; -- data lama (grade A/B/C) tidak bisa dipetakan otomatis, reset ke NULL

-- Convert ai_inference_log.grade_result (kolom ini juga pakai tipe freshness_grade)
ALTER TABLE public.ai_inference_log
  ALTER COLUMN grade_result DROP DEFAULT,
  ALTER COLUMN grade_result TYPE freshness_grade
    USING NULL;

-- Baru sekarang tipe lama aman dihapus, tidak ada lagi kolom yang depend padanya
DROP TYPE freshness_grade_old;

-- Kolom tambahan yang dibutuhkan model (fusion visual+tabular)
ALTER TABLE public.catches
  ADD COLUMN IF NOT EXISTS status_ikan TEXT CHECK (status_ikan IN ('HIDUP', 'MATI')),
  ADD COLUMN IF NOT EXISTS ice_to_fish_ratio NUMERIC(4, 3) CHECK (ice_to_fish_ratio BETWEEN 0 AND 1),
  ADD COLUMN IF NOT EXISTS ambient_temp_celsius NUMERIC(4, 1),
  ADD COLUMN IF NOT EXISTS fish_category TEXT CHECK (fish_category IN ('campuran', 'teri_non_grade', 'rucah'));

-- storage_method sebelumnya TEXT bebas -- batasi ke 3 nilai yang dikenali model
ALTER TABLE public.catches
  ADD CONSTRAINT chk_storage_method
  CHECK (storage_method IN ('crushed_ice', 'chilled_seawater', 'ambient'));

-- Tambah kolom hasil AI tambahan
ALTER TABLE public.catches
  ADD COLUMN IF NOT EXISTS hilirisasi_recommendation TEXT,
  ADD COLUMN IF NOT EXISTS ai_override_applied BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN public.catches.status_ikan IS 'Status ikan saat ditangkap — wajib untuk model AI';
COMMENT ON COLUMN public.catches.ice_to_fish_ratio IS 'Rasio es terhadap berat ikan, 0.0-1.0';
COMMENT ON COLUMN public.catches.fish_category IS 'Kategori tangkapan untuk keperluan hilirisasi';
COMMENT ON COLUMN public.catches.hilirisasi_recommendation IS 'Rekomendasi pemanfaatan dari model AI berdasarkan grade';