// All copy for the pembeli account page (/pembeli/akun). Edit here to swap content without touching layout.
// The account itself is read from Supabase — see lib/pembeli/account.ts.
import type { IconName } from '@/components/ui/icon'
import type { FormFieldConfig } from '@/components/register/form-field'
import { pembeliUsaha } from '@/components/register/content'
import { registerCopyId } from '@/lib/i18n/indonesian'
import { PEMBELI_ROLE_LABEL } from '@/components/pembeli/content'

export const AKUN_PATH = '/pembeli/akun'

export type AccountValues = {
  contactName: string
  // Shown in the dashboard chrome; empty means the business name. See lib/supabase/display-name.ts.
  nickname: string
  businessName: string
  email: string
  phone: string
  address: string
  // Kemendagri codes, as in lib/wilayah: "35" is Jawa Timur, "35.78" Kota Surabaya.
  provinsi: string
  kabKota: string
  kecamatan: string
  kodePos: string
  jenisUsaha: string[]
}

export const AKUN_PAGE = {
  title: 'Akun',
  subtitle: 'Kelola informasi dan preferensi akun Anda.',
}

export type AccountNavItem = { href: string; label: string; icon: IconName }

// "Sub Navigation". Only Info Pribadi is designed so far; the other two sections are still to come.
export const AKUN_NAV = {
  label: 'Bagian akun',
  items: [
    { href: AKUN_PATH, label: 'Info Pribadi', icon: 'user' },
    { href: `${AKUN_PATH}/preferensi`, label: 'Preferensi', icon: 'sliders-horizontal' },
    { href: `${AKUN_PATH}/notifikasi`, label: 'Notifikasi', icon: 'bell' },
  ] satisfies AccountNavItem[],
  signOutLabel: 'Keluar',
}

export const PROFILE_HEADER = {
  roleLabel: PEMBELI_ROLE_LABEL,
  changePhotoLabel: 'Ubah foto',
  // Photo upload isn't built yet, so the button is shown disabled with this reason.
  changePhotoUnavailable: 'Unggah foto belum tersedia.',
}

type TextField = Pick<FormFieldConfig, 'id' | 'label' | 'icon' | 'placeholder' | 'required'> &
  Partial<Pick<FormFieldConfig, 'inputType' | 'inputMode' | 'autoComplete' | 'helper' | 'locked'>>

type SelectField = Pick<FormFieldConfig, 'id' | 'label' | 'icon' | 'placeholder'>

export const INFO_PRIBADI = {
  title: 'Info Pribadi',
  subtitle: 'Data dasar akun dan usaha Anda. Kolom bertanda * wajib diisi.',
  fields: {
    contactName: { id: 'contactName', label: 'Nama lengkap', icon: 'user', placeholder: 'Nama penanggung jawab', required: true, autoComplete: 'name' },
    nickname: {
      id: 'nickname',
      label: 'Nama panggilan',
      icon: 'message-circle',
      placeholder: 'Contoh: Bu Sari',
      autoComplete: 'nickname',
      helper: 'Ditampilkan di dashboard. Kosongkan untuk memakai nama usaha.',
    },
    businessName: { id: 'businessName', label: 'Nama usaha', icon: 'building-2', placeholder: 'Nama usaha atau perusahaan', required: true, autoComplete: 'organization' },
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
    phone: { id: 'phone', label: 'Nomor telepon', icon: 'phone', placeholder: '+62 812 3456 7890', required: true, inputType: 'tel', inputMode: 'tel', autoComplete: 'tel' },
    address: { id: 'address', label: 'Alamat usaha', icon: 'map-pin', placeholder: 'Nama jalan dan nomor', required: true, autoComplete: 'street-address' },
    // Free text for now: there's no kecamatan list in lib/wilayah to drive a dropdown like the design's.
    kecamatan: { id: 'kecamatan', label: 'Kecamatan', icon: 'signpost', placeholder: 'Nama kecamatan' },
    kodePos: { id: 'kodePos', label: 'Kode pos', icon: 'mailbox', placeholder: '60185', inputMode: 'numeric', autoComplete: 'postal-code' },
  } satisfies Record<string, TextField>,
  provinsi: { id: 'provinsi', label: 'Provinsi', icon: 'map', placeholder: 'Pilih provinsi' } satisfies SelectField,
  kabKota: {
    id: 'kabKota',
    label: 'Kota/kabupaten',
    icon: 'building',
    placeholder: 'Pilih kota/kabupaten',
    lockedHelper: 'Pilih provinsi terlebih dahulu.',
  } satisfies SelectField & { lockedHelper: string },
  jenisUsaha: {
    ...pembeliUsaha(registerCopyId).jenisUsaha,
    label: 'Klasifikasi jenis usaha',
    helper: 'Pilih satu atau lebih. Dipakai untuk menyesuaikan rekomendasi dan penawaran untuk Anda.',
  },
  saveLabel: 'Simpan perubahan',
  savingLabel: 'Menyimpan…',
  savedMessage: 'Perubahan disimpan.',
}

// Messages from the "Validasi gagal" state, checked on save.
export const VALIDATION = {
  required: (label: string) => `Isi ${label.toLocaleLowerCase('id')}.`,
  choose: (label: string) => `Pilih ${label.toLocaleLowerCase('id')}.`,
  phone: 'Masukkan nomor lengkap, contoh +62 812 3456 7890.',
  nickname: (max: number) => `Gunakan paling banyak ${max} karakter.`,
  kodePos: 'Kode pos terdiri dari 5 angka.',
  jenisUsaha: 'Pilih minimal satu jenis usaha.',
}

// "Pindah bagian dengan perubahan belum disimpan".
export const UNSAVED_DIALOG = {
  title: 'Simpan perubahan dulu?',
  body: 'Anda mengubah Info Pribadi tapi belum menyimpannya. Kalau pindah sekarang, perubahan itu hilang.',
  discardLabel: 'Buang perubahan',
  saveLabel: 'Simpan',
}
