-- ============================================================
-- Listing kedaluwarsa otomatis setelah 48 jam
-- ============================================================
-- Trigger set_catch_expiry mengisi expires_at (+48 jam) saat listing dipasang,
-- tapi tidak ada yang mengubah statusnya setelah waktu itu lewat. File ini
-- menambahkan job pg_cron yang setiap 5 menit menandai listing LISTED yang
-- batas waktunya sudah lewat sebagai EXPIRED.
--
-- Aplikasi tidak menunggu job ini: marketplace menyembunyikan listing yang
-- sudah lewat waktunya, dan halaman nelayan langsung menampilkannya sebagai
-- kedaluwarsa (lib/supabase/catches.ts, isOverdue). Job ini menyamakan isi
-- database-nya, supaya laporan dan query lain juga melihat status yang benar.
--
-- Jalankan sekali di Supabase SQL Editor. Aman dijalankan ulang.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION public.expire_overdue_listings()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH expired AS (
    UPDATE public.catches
       SET status = 'EXPIRED'
     WHERE status = 'LISTED'
       AND expires_at IS NOT NULL
       AND expires_at <= NOW()
    RETURNING id
  )
  SELECT count(*)::integer FROM expired;
$$;

-- Hanya job terjadwal yang memanggilnya, bukan client.
REVOKE ALL ON FUNCTION public.expire_overdue_listings() FROM PUBLIC, anon, authenticated;

-- Jadwal dengan nama yang sama ditimpa, jadi file ini aman dijalankan ulang.
SELECT cron.schedule('expire-overdue-listings', '*/5 * * * *', $$SELECT public.expire_overdue_listings()$$);

-- Tandai yang sudah lewat sekarang juga, tanpa menunggu jadwal pertama.
SELECT public.expire_overdue_listings();
