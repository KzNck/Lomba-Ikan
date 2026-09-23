# ByCatch Loop — Frontend

Next.js 16 (App Router) di atas Supabase: auth, tabel `catches`/`transactions`, dan
Freshness AI API.

## Menjalankan

```bash
npm install
cp .env.example .env.local   # lalu isi kredensialnya
npm run dev
```

## Environment

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ya | URL project Supabase. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ya | Publishable key (`sb_publishable_…`), Settings > API Keys. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | tidak | Anon JWT lama; dipakai hanya kalau publishable key kosong. |

## Yang perlu diatur di Supabase

Tidak bisa diatur dari kode; kerjakan sekali di dashboard.

1. **Template Confirm signup.** Konfirmasi email menyala, jadi tautan di email
   harus mengarah ke `/auth/confirm`. Salin isi
   `supabase/email-templates/confirm-signup.html` ke *Authentication > Email
   Templates > Confirm signup* (subjeknya ada di komentar baris pertama). Template
   bawaan memakai `{{ .ConfirmationURL }}`, yang menuju endpoint Supabase, bukan
   app ini, jadi harus diganti.
2. **Site URL.** *Authentication > URL Configuration*: isi Site URL (mis.
   `http://localhost:3000` saat pengembangan) dan tambahkan redirect URL tiap
   domain yang dipakai. `{{ .SiteURL }}` di template mengambil nilai ini, dan
   tautan ke domain yang tidak terdaftar akan ditolak.
3. **Bucket foto.** Jalankan `supabase/storage.sql` di *SQL Editor*. Skrip itu
   membuat bucket `catch-photos` beserta policy-nya (baca publik, tulis hanya ke
   folder sendiri) dan aman dijalankan ulang. Tanpa bucket, pencatatan tangkapan
   tetap jalan dan foto tetap dinilai AI — hanya `catches.photo_url` yang
   dibiarkan kosong, dan log server menyebut "Bucket not found".
4. **Schema.** `supabase/schema.sql` sudah ter-deploy. Jalankan ulang hanya
   kalau project-nya diganti.
5. **Template Reset Password.** Salin isi
   `supabase/email-templates/reset-password.html` ke *Authentication > Email
   Templates > Reset Password*. Dengan template bawaan tautan "Lupa password"
   tetap berfungsi, tapi hanya di browser yang memintanya.
6. **File SQL tambahan.** Jalankan sekali di *SQL Editor*, berurutan:
   `supabase/catches-delete.sql` (tangkapan yang belum terjual bisa dihapus),
   `supabase/expire-listings.sql` (listing kedaluwarsa otomatis),
   `supabase/pickup-confirmation.sql` (konfirmasi penerimaan pembeli), lalu
   `supabase/transactions-lockdown.sql` (transaksi hanya bisa diubah lewat
   fungsi yang memeriksa pemanggilnya). Project yang `schema.sql`-nya dijalankan
   sebelum role dan grade dikunci juga perlu `supabase/profiles-role-lock.sql`
   (role hanya ditetapkan saat registrasi dan tidak bisa diubah user) dan
   `supabase/catches-lockdown.sql` (grade hanya ditulis Edge Function
   `grade-catch`, dan status tangkapan hanya berpindah lewat alur aplikasi);
   `schema.sql` yang sekarang sudah memuat keduanya. Urutan lengkapnya ada di
   `INSTALLATION.md` §3.2.

## Alur data

```
Registrasi ──> signUp(email, password)   profil dititipkan di user_metadata
                     │
        ┌────────────┴────────────┐
   konfirmasi email          konfirmasi mati
   /auth/confirm             sesi langsung ada
        └────────────┬────────────┘
                     │
              row `profiles` dibuat (ensureProfile)
                     │
     ┌───────────────┴───────────────┐
  Nelayan                         Pembeli
  catat tangkapan                 marketplace (catches berstatus LISTED)
   └─ grade-catch ─> grade         └─ klaim ─> Edge Function process-escrow
   └─ pasang listing ─> LISTED            └─ transactions
```

Masuk memakai email + password (`signInWithPassword`). Password minimal 8
karakter — lihat `MIN_PASSWORD_LENGTH` di `lib/supabase/auth.ts`.

Tautan konfirmasi hanya berlaku sekali dan bisa kedaluwarsa, jadi
`/auth/daftar/konfirmasi` punya tombol kirim ulang (jeda 60 detik, karena
Supabase membatasi frekuensinya). Mencoba masuk dengan akun yang belum
dikonfirmasi juga diarahkan ke sana, bukan ditolak dengan pesan buntu.

- Query Supabase ada di `lib/supabase/` — semuanya sisi server, memakai cookie
  sesi, jadi RLS yang menentukan baris mana yang kelihatan.
- Row database dibentuk jadi props komponen di `lib/catches/present.ts` dan
  `lib/marketplace/batches.ts`.
- Proxy (`proxy.ts`) menyegarkan sesi dan menjaga `/nelayan`, `/pembeli`, dan
  `/marketplace`. Pengecekan role ada di layout masing-masing area.

## Yang belum punya kolom di database

Ditulis di sini supaya tidak terlihat seperti bug:

- **Data usaha pembeli** (nama usaha, alamat, wilayah, jenis usaha) disimpan di
  `user_metadata`, bukan `profiles` — lihat `lib/pembeli/account.ts`.
- **Foto** hanya satu per tangkapan (`photo_url`), jadi carousel drawer berisi
  satu foto.
- **Jarak ke PPI** dihitung dari titik tengah kabupaten/kota pembeli, bukan
  alamat persisnya. Koordinat pelabuhan berasal dari data PIPP KKP
  (`lib/wilayah/pelabuhan.json`, dibuat oleh `scripts/build-wilayah.mjs`).
- **Nama kapal dan metode tangkap** belum ditanyakan wizard.

## Kosakata yang harus sama di tiga tempat

Wizard "Tambah Tangkapan" memakai kata sehari-hari; database dan model AI
memakai kosakata sendiri. Terjemahannya cuma ada di satu tempat,
`lib/catches/model-inputs.ts`, dan hasilnya ikut disimpan di row-nya:

| Wizard | `storage_method` | `ice_to_fish_ratio` |
| --- | --- | --- |
| Banyak Es | `crushed_ice` | 1.0 |
| Sedikit Es | `chilled_seawater` | 0.5 |
| Tanpa Es | `ambient` | 0.0 |

Kategori tangkapan dipetakan ke `fish_category` (`campuran`,
`teri_non_grade`, `rucah`). `status_ikan` berasal dari langkah "Kondisi"
(Hidup → `HIDUP`, Mati → `MATI`); suhu sekitar belum ditanyakan, jadi
`ambient_temp_celsius` selalu 30. Kolom-kolom ini dibatasi CHECK di database, jadi nilai di luar
daftar akan ditolak saat insert, bukan diam-diam tersimpan.

`freshness_grade` memakai enum `A1`…`B3`, sama persis dengan keluaran model.
