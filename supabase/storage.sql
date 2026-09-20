-- ============================================================
-- STORAGE: bucket foto tangkapan (catch-photos)
-- ============================================================
--
-- Bucket ini tadinya dibuat manual lewat dashboard, jadi gampang terlewat:
-- kalau belum ada, `uploadCatchPhoto` gagal dengan "Bucket not found" dan
-- `catches.photo_url` dibiarkan kosong tanpa ada yang menyadarinya (pencatatan
-- dan penilaian AI tetap jalan — lihat lib/supabase/storage.ts).
--
-- Jalankan sekali di SQL Editor Supabase. Aman diulang.
--
-- Path foto: <user_id>/<catch_id>.jpg — lihat uploadCatchPhoto.

-- Bucket publik: URL foto ikut ditempel di listing dan halaman riwayat.
INSERT INTO storage.buckets (id, name, public)
VALUES ('catch-photos', 'catch-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy storage.objects tidak mendukung IF NOT EXISTS di semua versi Postgres
-- yang dipakai Supabase, jadi dihapus dulu supaya skripnya bisa dijalankan ulang.
DROP POLICY IF EXISTS "catch photos: public read" ON storage.objects;
DROP POLICY IF EXISTS "catch photos: owner upload" ON storage.objects;
DROP POLICY IF EXISTS "catch photos: owner update" ON storage.objects;
DROP POLICY IF EXISTS "catch photos: owner delete" ON storage.objects;

-- Siapa pun boleh melihat: foto tampil di marketplace untuk pembeli yang belum
-- tentu punya sesi saat halamannya di-render.
CREATE POLICY "catch photos: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'catch-photos');

-- Tulis hanya ke folder sendiri: nama file diawali user id pemiliknya.
CREATE POLICY "catch photos: owner upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'catch-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- upsert: true di uploadCatchPhoto menimpa foto lama, jadi UPDATE ikut dibuka.
CREATE POLICY "catch photos: owner update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'catch-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'catch-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "catch photos: owner delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'catch-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
