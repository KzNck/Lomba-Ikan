-- ============================================================
-- Batalkan reservasi (transaksi yang masih berjalan)
-- ============================================================
-- Pembeli atau nelayan sebuah transaksi yang belum selesai bisa membatalkannya:
-- transaksi jadi CANCELLED dan batch-nya kembali ke marketplace. Pembeli tidak
-- boleh mengubah row `catches` milik nelayan (RLS), jadi keduanya diubah di
-- sini sekaligus, setelah memastikan pemanggilnya salah satu pihak transaksi.
--
-- Batch kembali dengan batas waktu listing yang lama, bukan 48 jam baru dari
-- trigger set_catch_expiry — ikannya tidak ikut jadi lebih segar. Kalau batas
-- itu sudah lewat, batch ditandai EXPIRED.
--
-- Siapa yang membatalkan dicatat di `notes` ('cancelled_by:pembeli' /
-- 'cancelled_by:nelayan') supaya pihak lain tahu dari riwayatnya.
--
-- Mengembalikan 'relisted', 'expired', atau 'cancelled' (batch tidak sedang
-- diklaim). Error 'not_found' untuk transaksi yang tidak ada atau bukan milik
-- pemanggil, 'not_in_progress' untuk yang sudah selesai atau dibatalkan.
--
-- Untuk project yang sudah berjalan: jalankan file ini sekali di SQL Editor.

CREATE OR REPLACE FUNCTION public.cancel_transaction(p_transaction_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tx public.transactions%ROWTYPE;
  item public.catches%ROWTYPE;
BEGIN
  SELECT * INTO tx FROM public.transactions WHERE id = p_transaction_id FOR UPDATE;
  IF NOT FOUND OR auth.uid() IS NULL OR auth.uid() NOT IN (tx.nelayan_id, tx.pembeli_id) THEN
    RAISE EXCEPTION 'not_found';
  END IF;
  IF tx.status IN ('COMPLETED', 'CANCELLED') THEN
    RAISE EXCEPTION 'not_in_progress';
  END IF;

  UPDATE public.transactions
  SET status = 'CANCELLED',
      notes = 'cancelled_by:' || CASE WHEN auth.uid() = tx.pembeli_id THEN 'pembeli' ELSE 'nelayan' END
  WHERE id = tx.id;

  SELECT * INTO item FROM public.catches WHERE id = tx.catch_id FOR UPDATE;
  IF item.status <> 'CLAIMED' THEN
    RETURN 'cancelled';
  END IF;

  IF item.expires_at IS NOT NULL AND item.expires_at > NOW() THEN
    UPDATE public.catches SET status = 'LISTED' WHERE id = item.id;
    -- The trigger just started a new 48-hour window; put the original one back.
    UPDATE public.catches SET listed_at = item.listed_at, expires_at = item.expires_at WHERE id = item.id;
    RETURN 'relisted';
  END IF;

  UPDATE public.catches SET status = 'EXPIRED' WHERE id = item.id;
  RETURN 'expired';
END;
$$;

REVOKE ALL ON FUNCTION public.cancel_transaction(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cancel_transaction(UUID) TO authenticated;
