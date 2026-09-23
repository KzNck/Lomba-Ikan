-- ============================================================
-- Kunci role di tabel profiles
-- ============================================================
-- Role dipilih sekali saat registrasi (nelayan atau pembeli) dan menentukan
-- dashboard serta data yang boleh dibaca (lihat policy tabel catches). File
-- ini memastikan role hanya ditetapkan oleh server:
--
--   * Pemilik hanya bisa membaca, membuat, dan mengubah row-nya sendiri; tidak
--     ada policy DELETE.
--   * Row baru dari sesi user hanya boleh ber-role 'nelayan' atau 'pembeli'.
--   * Role tidak bisa diubah dari sesi user. Mengubahnya (termasuk memberi
--     'admin') hanya lewat SQL Editor atau service role.
--
-- Jalankan sekali di Supabase SQL Editor. Aman dijalankan ulang.
-- ============================================================

-- 1. Ganti policy FOR ALL dengan policy per operasi.
DROP POLICY IF EXISTS "profiles: self access" ON public.profiles;
DROP POLICY IF EXISTS "profiles: self read" ON public.profiles;
DROP POLICY IF EXISTS "profiles: self insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles: self update" ON public.profiles;

CREATE POLICY "profiles: self read"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: self insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id AND role IN ('nelayan', 'pembeli'));

CREATE POLICY "profiles: self update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. Role tetap setelah row dibuat. Policy UPDATE tidak bisa membandingkan nilai
--    lama dan baru, jadi dicek di trigger. `current_user` adalah role Postgres
--    pemanggil: authenticated/anon untuk request dari aplikasi, postgres untuk
--    SQL Editor, service_role untuk Edge Function.
CREATE OR REPLACE FUNCTION public.keep_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND current_user IN ('authenticated', 'anon') THEN
    RAISE EXCEPTION 'role_locked';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_keep_role ON public.profiles;
CREATE TRIGGER trg_profiles_keep_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.keep_profile_role();
