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
| `FRESHNESS_API_URL` | tidak | Base URL Freshness AI API. Kosong → tangkapan tersimpan tanpa grade. |

## Yang perlu diatur di Supabase

Tidak bisa diatur dari kode; kerjakan sekali di dashboard.

1. **Template Confirm signup.** Konfirmasi email menyala, jadi tautan di email
   harus mengarah ke `/auth/confirm`. Ubah *Authentication > Email Templates >
   Confirm signup* menjadi:

   ```html
   <h2>Konfirmasi email Anda</h2>
   <p>Klik tautan di bawah untuk mengaktifkan akun ByCatch Loop Anda.</p>
   <p>
     <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
       Konfirmasi email saya
     </a>
   </p>
   ```

   `type=email` — itu yang dipakai template Confirm signup. Template bawaan
   memakai `{{ .ConfirmationURL }}`, yang menuju endpoint Supabase, bukan app
   ini, jadi harus diganti.
2. **Site URL.** *Authentication > URL Configuration*: isi Site URL (mis.
   `http://localhost:3000` saat pengembangan) dan tambahkan redirect URL tiap
   domain yang dipakai. `{{ .SiteURL }}` di template mengambil nilai ini, dan
   tautan ke domain yang tidak terdaftar akan ditolak.
3. **Bucket foto.** *Storage > New bucket*, nama `catch-photos`, set public.
   Tanpa bucket, pencatatan tangkapan tetap jalan dan foto tetap dinilai AI —
   hanya `catches.photo_url` yang dibiarkan kosong.
4. **Schema.** `supabase/schema.sql` sudah ter-deploy. Jalankan ulang hanya
   kalau project-nya diganti.

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
   └─ Freshness API ─> grade       └─ klaim ─> Edge Function process-escrow
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
- Realtime (`lib/supabase/realtime.ts`) khusus browser.
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
- **Koordinat PPI** tidak ada di data pelabuhan nasional, jadi peta hanya
  menandai PPI yang koordinatnya terdaftar di `PPI_LOCATIONS`, dan jarak hanya
  dihitung kalau kedua PPI-nya punya koordinat.
- **Preferensi pencarian pembeli** belum tersimpan; marketplace memakai default
  di `PREFERENCES`.
- **Nama kapal dan metode tangkap** belum ditanyakan wizard.
- **Lupa password** belum ada layarnya; `resetPasswordForEmail` tinggal
  dipasang kalau dibutuhkan.

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
`teri_non_grade`, `rucah`). `status_ikan` masih selalu `MATI` — wizard belum
menanyakannya. Kolom-kolom ini dibatasi CHECK di database, jadi nilai di luar
daftar akan ditolak saat insert, bukan diam-diam tersimpan.

`freshness_grade` memakai enum `A1`…`B3`, sama persis dengan keluaran model.

## Catatan: Edge Function `trigger-freshness`

`supabase/functions/trigger-freshness/index.ts` sudah tidak cocok dengan
Freshness API: ia mengirim JSON dan membaca `grade`/`score`/`notes`, sedangkan
endpoint `/api/v1/predict` menerima `multipart/form-data` (termasuk foto) dan
mengembalikan `predicted_grade`/`confidence_score`/`rationale`. App memanggil
API-nya langsung lewat `lib/freshness/client.ts`, jadi webhook itu tidak dipakai.
