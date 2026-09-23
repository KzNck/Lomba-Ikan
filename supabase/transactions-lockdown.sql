-- ============================================================
-- Kunci perubahan tabel transactions
-- ============================================================
-- Sebelumnya policy "transactions: parties access" (FOR ALL) mengizinkan
-- nelayan dan pembeli mengubah kolom APA PUN di transaksinya lewat API —
-- status, harga, berat akhir. File ini menggantinya:
--
--   * Pihak transaksi hanya bisa MEMBACA row-nya.
--   * Pembeli mengatur jadwal pengambilan dan mengonfirmasi penerimaan lewat
--     dua fungsi di bawah, yang memeriksa pemanggil dan status transaksinya.
--   * Transaksi tidak bisa ditandai COMPLETED sebelum pembeli mengonfirmasi
--     penerimaan (PRD story 9). Trigger ini berlaku juga untuk Edge Function
--     confirm-handover yang memakai service role.
--
-- Klaim (process-escrow) dan serah terima (confirm-handover) tetap lewat Edge
-- Function dengan service role; pembatalan tetap lewat cancel_transaction.
--
-- Butuh supabase/pickup-confirmation.sql lebih dulu. Jalankan sekali di
-- Supabase SQL Editor. Aman dijalankan ulang.
-- ============================================================

-- 1. Baca saja untuk pihak transaksi. Tanpa policy INSERT/UPDATE/DELETE, semua
--    tulis langsung dari client ditolak.
DROP POLICY IF EXISTS "transactions: parties access" ON public.transactions;
DROP POLICY IF EXISTS "transactions: parties read" ON public.transactions;
CREATE POLICY "transactions: parties read"
  ON public.transactions FOR SELECT
  USING (auth.uid() = nelayan_id OR auth.uid() = pembeli_id);

-- 2. Jadwal pengambilan, dari pembeli transaksi yang masih berjalan. Paling lama
--    7 hari ke depan (sama dengan batas di aplikasi). TRUE kalau tersimpan.
CREATE OR REPLACE FUNCTION public.set_pickup_schedule(p_transaction_id UUID, p_at TIMESTAMPTZ)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_at < NOW() - INTERVAL '1 hour' OR p_at > NOW() + INTERVAL '7 days' THEN
    RAISE EXCEPTION 'schedule_out_of_range';
  END IF;

  UPDATE public.transactions
     SET delivery_scheduled_at = p_at
   WHERE id = p_transaction_id
     AND pembeli_id = auth.uid()
     AND status NOT IN ('COMPLETED', 'CANCELLED');
  RETURN FOUND;
END;
$$;

-- 3. "Batch sudah diterima", dari pembeli transaksi yang masih berjalan. Waktu
--    konfirmasi pertama dipertahankan kalau dipanggil ulang. TRUE kalau tercatat.
CREATE OR REPLACE FUNCTION public.confirm_pickup_receipt(p_transaction_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.transactions
     SET pembeli_confirmed_at = COALESCE(pembeli_confirmed_at, NOW())
   WHERE id = p_transaction_id
     AND pembeli_id = auth.uid()
     AND status NOT IN ('COMPLETED', 'CANCELLED');
  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.set_pickup_schedule(UUID, TIMESTAMPTZ) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.confirm_pickup_receipt(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_pickup_schedule(UUID, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_pickup_receipt(UUID) TO authenticated;

-- 4. Tidak ada transaksi selesai tanpa konfirmasi pembeli, dari jalur mana pun.
CREATE OR REPLACE FUNCTION public.require_buyer_confirmation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'COMPLETED' AND OLD.status IS DISTINCT FROM 'COMPLETED' AND NEW.pembeli_confirmed_at IS NULL THEN
    RAISE EXCEPTION 'buyer_not_confirmed';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_transactions_require_buyer_confirmation ON public.transactions;
CREATE TRIGGER trg_transactions_require_buyer_confirmation
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.require_buyer_confirmation();
