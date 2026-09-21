// All copy for the nelayan account page (/nelayan/akun). Edit here to swap content without touching layout.
// The account itself is read from Supabase — see lib/nelayan/account.ts. The layout follows the pembeli account page.
import type { FormFieldConfig } from '@/components/register/form-field'
import type { AccountNavItem } from '@/components/pembeli/akun-content'
import { nelayanProfile } from '@/components/register/content'
import { registerCopyId } from '@/lib/i18n/indonesian'
import { NELAYAN_ROLE_LABEL } from '@/components/nelayan/content'

export const AKUN_PATH = '/nelayan/akun'

export type AccountValues = {
  fullName: string
  // Shown in the dashboard chrome instead of the full name; empty means the first name. See lib/supabase/display-name.ts.
  nickname: string
  email: string
  phone: string
  // Kemendagri codes, as in lib/wilayah, then the port's id: the landing site the fisher sells from.
  provinsi: string
  kabKota: string
  ppi: string
  bankAccount: string
}

export const AKUN_PAGE = {
  breadcrumb: 'Akun',
  title: 'Akun',
  subtitle: 'Kelola data diri, lokasi pendaratan, dan rekening pencairan Anda.',
}

// "Sub Navigation". Only Info Pribadi exists so far.
export const AKUN_NAV = {
  label: 'Bagian akun',
  items: [{ href: AKUN_PATH, label: 'Info Pribadi', icon: 'user' }] satisfies AccountNavItem[],
  signOutLabel: 'Keluar',
}

export const PROFILE_HEADER = {
  roleLabel: NELAYAN_ROLE_LABEL,
  changePhotoLabel: 'Ubah foto',
  // Photo upload isn't built yet, so the button is shown disabled with this reason.
  changePhotoUnavailable: 'Unggah foto belum tersedia.',
  // Shown in place of the landing site until one is saved.
  noPpi: 'PPI belum diatur',
}

type TextField = Pick<FormFieldConfig, 'id' | 'label' | 'icon' | 'placeholder' | 'required'> &
  Partial<Pick<FormFieldConfig, 'inputType' | 'inputMode' | 'autoComplete' | 'helper' | 'locked'>>

const { location } = nelayanProfile(registerCopyId)

export const INFO_PRIBADI = {
  title: 'Info Pribadi',
  subtitle: 'Data diri, lokasi pendaratan, dan rekening Anda. Kolom bertanda * wajib diisi.',
  fields: {
    fullName: { id: 'fullName', label: 'Nama lengkap', icon: 'user', placeholder: 'Contoh: Dulmatin', required: true, autoComplete: 'name' },
    nickname: {
      id: 'nickname',
      label: 'Nama panggilan',
      icon: 'message-circle',
      placeholder: 'Contoh: Pak Dul',
      autoComplete: 'nickname',
      helper: 'Ditampilkan di dashboard. Kosongkan untuk memakai nama depan Anda.',
    },
    email: {
      id: 'email',
      label: 'Email',
      icon: 'mail',
      placeholder: '',
      required: true,
      inputType: 'email',
      locked: true,
      helper: 'Email dipakai untuk masuk. Hubungi admin untuk menggantinya.',
    },
    phone: {
      id: 'phone',
      label: 'Nomor telepon',
      icon: 'phone',
      placeholder: '+62 812 3456 7890',
      inputType: 'tel',
      inputMode: 'tel',
      autoComplete: 'tel',
      helper: 'Dipakai pembeli dan petugas PPI untuk menghubungi Anda.',
    },
    bankAccount: {
      id: 'bankAccount',
      label: 'Rekening bank',
      icon: 'wallet',
      placeholder: 'Contoh: BRI 1234 5678 9012 a.n. Dulmatin',
      helper: 'Tulis nama bank, nomor rekening, dan nama pemilik.',
    },
  } satisfies Record<string, TextField>,
  location: {
    title: 'Lokasi Pendaratan',
    subtitle: 'PPI tempat Anda mendaratkan dan menjual hasil tangkapan. Pembeli melihatnya di setiap listing.',
    // Registration's selects, relabelled in this form's sentence case. The empty-list hint can't point at
    // registration's "PPI saya tidak ada di daftar" link, which isn't on this page, so it gives the address itself.
    provinsi: { ...location.provinsi, id: 'provinsi' },
    kabKota: { ...location.kabKota, id: 'kabKota', label: 'Kota/kabupaten' },
    pelabuhan: {
      ...location.pelabuhan,
      id: 'ppi',
      label: 'Pangkalan pendaratan ikan (PPI)',
      emptyHelper: 'Belum ada PPI terdaftar di kota/kabupaten ini. Kirim email ke info@bycatchloop.id untuk menambahkannya.',
    },
  },
  bank: {
    title: 'Rekening Pencairan',
    subtitle: 'Opsional. Isi supaya hasil penjualan bisa langsung dicairkan ke rekening Anda.',
  },
  saveLabel: 'Simpan perubahan',
  savingLabel: 'Menyimpan…',
  savedMessage: 'Perubahan disimpan.',
}

// Messages from the "Validasi gagal" state, checked on save.
export const VALIDATION = {
  required: (label: string) => `Isi ${label.toLocaleLowerCase('id')}.`,
  provinsi: 'Pilih provinsi.',
  kabKota: 'Pilih kota/kabupaten.',
  ppi: 'Pilih PPI tempat Anda mendaratkan tangkapan.',
  phone: 'Masukkan nomor lengkap, contoh +62 812 3456 7890.',
  nickname: (max: number) => `Gunakan paling banyak ${max} karakter.`,
  // A failed save, shown by the save button rather than on a field: nothing the fisher typed was wrong.
  saveFailed: 'Perubahan belum tersimpan. Periksa koneksi internet Anda, lalu coba simpan lagi.',
}

// "Pindah bagian dengan perubahan belum disimpan".
export const UNSAVED_DIALOG = {
  title: 'Simpan perubahan dulu?',
  body: 'Anda mengubah Info Pribadi tapi belum menyimpannya. Kalau pindah sekarang, perubahan itu hilang.',
  discardLabel: 'Buang perubahan',
  saveLabel: 'Simpan',
}
