-- ============================================================
-- HAPUS LISTING: nelayan menghapus tangkapan secara permanen
-- ============================================================
-- "Hapus listing" di "Listing Saya" menghapus row catches (dan fotonya).
-- Aplikasi hanya mengizinkannya untuk draft (WAITING_FOR_SYNC) dan listing
-- kedaluwarsa (EXPIRED) yang tidak punya transaksi. Database menjaga sisanya:
--   * transactions.catch_id ON DELETE RESTRICT: tangkapan yang pernah
--     diklaim tidak bisa dihapus, jadi riwayat transaksi tetap utuh.
--   * ai_inference_log.catch_id ON DELETE CASCADE: log penilaian ikut terhapus.
--   * sync_log.catch_id tidak punya aturan ON DELETE, sehingga tangkapan yang
--     masuk lewat sinkronisasi offline gagal dihapus. File ini mengubahnya
--     menjadi SET NULL: catatan sinkronnya tetap ada, tanpa tautan ke row
--     yang sudah dihapus.
--
-- Jalankan sekali di Supabase SQL Editor. Aman dijalankan ulang.
-- ============================================================

ALTER TABLE public.sync_log DROP CONSTRAINT IF EXISTS sync_log_catch_id_fkey;

ALTER TABLE public.sync_log
  ADD CONSTRAINT sync_log_catch_id_fkey
  FOREIGN KEY (catch_id) REFERENCES public.catches(id) ON DELETE SET NULL;
