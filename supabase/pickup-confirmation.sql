-- ============================================================
-- Pengambilan batch: jadwal dari pembeli, konfirmasi dua pihak
-- ============================================================
-- Detail Transaksi (designv2 §9): pembeli mengatur jadwal pengambilan
-- (kolom delivery_scheduled_at yang sudah ada), lalu mengonfirmasi bahwa
-- batch sudah diterima. Nelayan baru bisa menandai transaksi selesai — dengan
-- berat akhir dari timbangan PPI — setelah pembeli mengonfirmasi (PRD story 9).
--
-- File ini menambahkan kolom untuk konfirmasi pembeli. Sebelum dijalankan,
-- aplikasi tetap berjalan seperti sebelumnya: nelayan bisa langsung
-- menyelesaikan transaksi tanpa menunggu pembeli.
--
-- Kedua kolom diisi langsung oleh aplikasi dengan sesi pembeli; policy
-- "transactions: parties access" sudah mengizinkan pihak transaksi mengubah
-- row-nya, dan aplikasi hanya mengubahnya selama transaksi masih berjalan.
--
-- Jalankan sekali di Supabase SQL Editor. Aman dijalankan ulang.
-- ============================================================

ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS pembeli_confirmed_at TIMESTAMPTZ;

COMMENT ON COLUMN public.transactions.pembeli_confirmed_at IS
  'Saat pembeli mengonfirmasi batch sudah diterima; syarat nelayan menandai transaksi selesai';
