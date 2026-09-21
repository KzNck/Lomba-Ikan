-- ============================================================
-- Kontak lawan transaksi (untuk tombol WhatsApp)
-- ============================================================
-- Profil hanya bisa dibaca pemiliknya (policy "profiles: self access"), jadi
-- pembeli tidak bisa melihat nomor nelayan dan sebaliknya. Fungsi ini
-- mengembalikan nama dan nomor telepon pihak lain dari satu transaksi — dan
-- hanya itu, bukan seluruh profil — kepada nelayan atau pembeli transaksi
-- tersebut. Orang lain mendapat hasil kosong.
--
-- Untuk project yang sudah berjalan: jalankan file ini sekali di SQL Editor.

CREATE OR REPLACE FUNCTION public.get_transaction_contact(p_transaction_id UUID)
RETURNS TABLE (full_name TEXT, phone TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.full_name, p.phone
  FROM public.transactions t
  JOIN public.profiles p
    ON p.id = CASE WHEN t.pembeli_id = auth.uid() THEN t.nelayan_id ELSE t.pembeli_id END
  WHERE t.id = p_transaction_id
    AND auth.uid() IN (t.nelayan_id, t.pembeli_id);
$$;

REVOKE ALL ON FUNCTION public.get_transaction_contact(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_transaction_contact(UUID) TO authenticated;
