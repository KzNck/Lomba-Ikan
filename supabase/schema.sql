-- ============================================================
-- SCHEMA: Nelayan Marketplace (Supabase/PostgreSQL)
-- Covers: auth, catches, freshness, transactions, sync log
-- ============================================================

-- Enable UUID extension (sudah default di Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM ('nelayan', 'pembeli', 'admin');

CREATE TYPE freshness_grade AS ENUM ('A', 'B', 'C');

CREATE TYPE catch_status AS ENUM (
  'WAITING_FOR_SYNC',   -- Tersimpan lokal, belum sync
  'LISTED',             -- Sudah sync, tampil di marketplace
  'CLAIMED',            -- Diklaim pembeli, dana escrow masuk
  'COMPLETED',          -- Serah terima selesai, dana cair
  'EXPIRED'             -- Waktu habis tanpa klaim
);

CREATE TYPE transaction_status AS ENUM (
  'ESCROW_PENDING',     -- Pembeli klaim, menunggu konfirmasi escrow
  'ESCROW_HELD',        -- Dana escrow sudah ditahan
  'DELIVERY_SCHEDULED', -- Jadwal truk pendingin sudah diset
  'WEIGHING_DONE',      -- Penimbangan fisik selesai
  'RECONCILED',         -- Rekonsiliasi berat & nilai akhir
  'COMPLETED',          -- Konfirmasi serah terima + QR scan
  'CANCELLED'
);

-- ============================================================
-- USERS (extend Supabase auth.users)
-- ============================================================

CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          user_role NOT NULL DEFAULT 'nelayan',
  full_name     TEXT NOT NULL,
  phone         TEXT,
  bank_account  TEXT,                        -- Rekening BRI nelayan
  ppi_location  TEXT,                        -- Pangkalan PPI default
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN public.profiles.bank_account IS 'Rekening tujuan dana cair otomatis (BRI)';

-- ============================================================
-- CATCHES (data tangkapan nelayan)
-- ============================================================

CREATE TABLE public.catches (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nelayan_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- 6 field input tangkapan
  species             TEXT NOT NULL,               -- Jenis ikan
  weight_kg           NUMERIC(8, 2) NOT NULL,      -- Berat estimasi (kg)
  catch_location      TEXT NOT NULL,               -- Lokasi tangkap (koordinat atau nama)
  catch_time          TIMESTAMPTZ NOT NULL,         -- Waktu tangkap
  storage_method      TEXT NOT NULL,               -- Metode penyimpanan (es balok, dll)
  vessel_name         TEXT NOT NULL,               -- Nama kapal

  -- AI freshness result
  freshness_grade     freshness_grade,             -- NULL sampai AI selesai proses
  freshness_score     NUMERIC(5, 2),               -- Skor mentah dari model (0-100)
  freshness_notes     TEXT,                        -- Penjelasan singkat dari model AI

  -- Status & marketplace
  status              catch_status NOT NULL DEFAULT 'WAITING_FOR_SYNC',
  listed_at           TIMESTAMPTZ,                 -- Kapan muncul di marketplace
  expires_at          TIMESTAMPTZ,                 -- Batas waktu klaim (default listed_at + 48 jam)
  price_per_kg        NUMERIC(10, 2),              -- Harga yang diset nelayan

  -- Offline sync tracking
  local_id            TEXT UNIQUE,                 -- ID dari IndexedDB sisi client
  synced_at           TIMESTAMPTZ,                 -- Waktu berhasil sync ke cloud

  -- Foto opsional
  photo_url           TEXT,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON COLUMN public.catches.local_id IS 'ID dari IndexedDB untuk idempotent upsert saat offline sync';
COMMENT ON COLUMN public.catches.expires_at IS 'Auto-set 48 jam setelah listed_at via trigger';

-- Auto-set expires_at saat status berubah ke LISTED
CREATE OR REPLACE FUNCTION set_catch_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'LISTED' AND OLD.status != 'LISTED' THEN
    NEW.listed_at = NOW();
    NEW.expires_at = NOW() + INTERVAL '48 hours';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_catch_expiry
  BEFORE UPDATE ON public.catches
  FOR EACH ROW EXECUTE FUNCTION set_catch_expiry();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_catches_updated_at
  BEFORE UPDATE ON public.catches
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ============================================================
-- TRANSACTIONS (klaim → escrow → serah terima)
-- ============================================================

CREATE TABLE public.transactions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  catch_id              UUID NOT NULL REFERENCES public.catches(id) ON DELETE RESTRICT,
  pembeli_id            UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  nelayan_id            UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,

  status                transaction_status NOT NULL DEFAULT 'ESCROW_PENDING',

  -- Nilai keuangan
  estimated_total       NUMERIC(12, 2) NOT NULL,    -- Harga saat klaim (berat estimasi × harga/kg)
  final_weight_kg       NUMERIC(8, 2),               -- Berat aktual setelah timbang di dermaga
  final_total           NUMERIC(12, 2),              -- Nilai akhir escrow setelah rekonsiliasi

  -- Logistik
  delivery_scheduled_at TIMESTAMPTZ,                -- Jadwal truk pendingin
  ppi_location          TEXT,                        -- Lokasi pangkalan PPI (Muara Angke, dll)
  weighing_done_at      TIMESTAMPTZ,
  weighing_officer      TEXT,                        -- Nama petugas penimbang

  -- Serah terima
  qr_scan_code          TEXT UNIQUE,                 -- QR code untuk konfirmasi serah terima
  handover_confirmed_at TIMESTAMPTZ,
  handover_photo_url    TEXT,

  -- Disbursement
  disbursed_at          TIMESTAMPTZ,                -- Dana cair ke rekening nelayan

  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ============================================================
-- AI INFERENCE LOG (tracking request ke AI endpoint)
-- ============================================================

CREATE TABLE public.ai_inference_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  catch_id        UUID NOT NULL REFERENCES public.catches(id) ON DELETE CASCADE,
  model_version   TEXT NOT NULL,                   -- Versi model yang dipakai
  input_payload   JSONB NOT NULL,                  -- Data yang dikirim ke model
  output_payload  JSONB,                           -- Response mentah dari model
  grade_result    freshness_grade,
  score_result    NUMERIC(5, 2),
  latency_ms      INTEGER,                         -- Response time
  status          TEXT NOT NULL DEFAULT 'pending', -- pending | success | error
  error_message   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.ai_inference_log IS 'Audit trail semua request ke AI freshness endpoint';

-- ============================================================
-- SYNC LOG (offline → online sync tracking)
-- ============================================================

CREATE TABLE public.sync_log (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nelayan_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  local_id      TEXT NOT NULL,                     -- ID dari IndexedDB
  catch_id      UUID REFERENCES public.catches(id),
  action        TEXT NOT NULL,                     -- 'create' | 'update'
  payload       JSONB NOT NULL,                    -- Data yang disync
  synced_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status        TEXT NOT NULL DEFAULT 'success'    -- 'success' | 'conflict' | 'error'
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_catches_nelayan_id    ON public.catches(nelayan_id);
CREATE INDEX idx_catches_status        ON public.catches(status);
CREATE INDEX idx_catches_local_id      ON public.catches(local_id);
CREATE INDEX idx_catches_expires_at    ON public.catches(expires_at) WHERE status = 'LISTED';
CREATE INDEX idx_transactions_catch    ON public.transactions(catch_id);
CREATE INDEX idx_transactions_pembeli  ON public.transactions(pembeli_id);
CREATE INDEX idx_ai_log_catch          ON public.ai_inference_log(catch_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catches        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_inference_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_log       ENABLE ROW LEVEL SECURITY;

-- profiles: lihat/edit profil sendiri saja
CREATE POLICY "profiles: self access"
  ON public.profiles FOR ALL
  USING (auth.uid() = id);

-- catches: nelayan CRUD miliknya; pembeli SELECT semua LISTED
CREATE POLICY "catches: nelayan owns"
  ON public.catches FOR ALL
  USING (auth.uid() = nelayan_id);

CREATE POLICY "catches: pembeli view listed"
  ON public.catches FOR SELECT
  USING (
    status = 'LISTED'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'pembeli'
    )
  );

-- transactions: kedua pihak bisa lihat transaksi mereka
CREATE POLICY "transactions: parties access"
  ON public.transactions FOR ALL
  USING (
    auth.uid() = nelayan_id OR auth.uid() = pembeli_id
  );

-- ai_inference_log: nelayan lihat miliknya; admin lihat semua
CREATE POLICY "ai_log: nelayan view own"
  ON public.ai_inference_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.catches c
      WHERE c.id = catch_id AND c.nelayan_id = auth.uid()
    )
  );

-- sync_log: nelayan lihat miliknya
CREATE POLICY "sync_log: nelayan own"
  ON public.sync_log FOR ALL
  USING (auth.uid() = nelayan_id);

-- ============================================================
-- REALTIME (enable untuk tabel yang perlu live update)
-- ============================================================

-- Jalankan di Supabase dashboard: Database > Replication
-- Atau via SQL:
ALTER PUBLICATION supabase_realtime ADD TABLE public.catches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;