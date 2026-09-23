-- ============================================================
-- Kunci hasil penilaian dan alur status tangkapan
-- ============================================================
-- Nelayan tetap mengelola tangkapannya sendiri (policy "catches: nelayan
-- owns"). Dari sesi user, trigger di bawah memastikan:
--
--   * Row baru selalu mulai sebagai WAITING_FOR_SYNC, tanpa grade dan tanpa
--     batas waktu listing.
--   * Hasil penilaian (freshness_*, hilirisasi_recommendation,
--     ai_override_applied) hanya ditulis Edge Function grade-catch.
--   * Input model dan catch_time tetap setelah dicatat, jadi penilaian ulang
--     memakai data yang sama.
--   * Status hanya berpindah WAITING_FOR_SYNC → LISTED (pasang listing) dan
--     WAITING_FOR_SYNC/LISTED → EXPIRED (batalkan). Klaim, serah terima, dan
--     pembatalan transaksi lewat Edge Function dan fungsi SQL.
--   * listed_at dan expires_at hanya diisi trigger set_catch_expiry.
--
-- Edge Function (service_role), fungsi SECURITY DEFINER, job pg_cron, dan SQL
-- Editor tidak dibatasi.
--
-- Jalankan sekali di Supabase SQL Editor. Aman dijalankan ulang.
-- ============================================================

CREATE OR REPLACE FUNCTION public.guard_catch_write()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF current_user NOT IN ('authenticated', 'anon') THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.status <> 'WAITING_FOR_SYNC'
       OR NEW.freshness_grade IS NOT NULL
       OR NEW.freshness_score IS NOT NULL
       OR NEW.freshness_notes IS NOT NULL
       OR NEW.hilirisasi_recommendation IS NOT NULL
       OR COALESCE(NEW.ai_override_applied, FALSE)
       OR NEW.listed_at IS NOT NULL
       OR NEW.expires_at IS NOT NULL THEN
      RAISE EXCEPTION 'catch_field_locked';
    END IF;
    RETURN NEW;
  END IF;

  IF (NEW.freshness_grade, NEW.freshness_score, NEW.freshness_notes, NEW.hilirisasi_recommendation,
      NEW.ai_override_applied, NEW.status_ikan, NEW.storage_method, NEW.ice_to_fish_ratio,
      NEW.ambient_temp_celsius, NEW.fish_category, NEW.catch_time)
     IS DISTINCT FROM
     (OLD.freshness_grade, OLD.freshness_score, OLD.freshness_notes, OLD.hilirisasi_recommendation,
      OLD.ai_override_applied, OLD.status_ikan, OLD.storage_method, OLD.ice_to_fish_ratio,
      OLD.ambient_temp_celsius, OLD.fish_category, OLD.catch_time) THEN
    RAISE EXCEPTION 'catch_field_locked';
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status
     AND NOT (OLD.status = 'WAITING_FOR_SYNC' AND NEW.status = 'LISTED')
     AND NOT (OLD.status IN ('WAITING_FOR_SYNC', 'LISTED') AND NEW.status = 'EXPIRED') THEN
    RAISE EXCEPTION 'catch_status_locked';
  END IF;

  -- trg_catch_expiry berjalan lebih dulu (urutan nama) dan mengisi keduanya saat listing dipasang.
  IF NOT (OLD.status = 'WAITING_FOR_SYNC' AND NEW.status = 'LISTED')
     AND (NEW.listed_at, NEW.expires_at) IS DISTINCT FROM (OLD.listed_at, OLD.expires_at) THEN
    RAISE EXCEPTION 'catch_field_locked';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_catches_guard ON public.catches;
CREATE TRIGGER trg_catches_guard
  BEFORE INSERT OR UPDATE ON public.catches
  FOR EACH ROW EXECUTE FUNCTION public.guard_catch_write();
