-- ============================================================
-- POLICY: pembeli membaca tangkapan yang sudah dibelinya
-- ============================================================
--
-- "catches: pembeli view listed" hanya membuka tangkapan berstatus LISTED.
-- Begitu diklaim (CLAIMED) atau selesai (COMPLETED), pembelinya sendiri tidak
-- bisa lagi membaca row tangkapan itu — halaman /pembeli/riwayat jadi
-- menampilkan kategori, grade, dan berat sebagai "—".
--
-- Policy ini membuka SELECT untuk tangkapan yang punya transaksi dengan
-- pembeli yang sedang login. Hanya baca; mengubah tetap hak nelayannya.
-- Tidak rekursif: policy transactions tidak membaca tabel catches.
--
-- Jalankan sekali di SQL Editor Supabase. Aman diulang.

DROP POLICY IF EXISTS "catches: pembeli view purchased" ON public.catches;

CREATE POLICY "catches: pembeli view purchased"
  ON public.catches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.transactions t
      WHERE t.catch_id = catches.id
        AND t.pembeli_id = auth.uid()
    )
  );
