// All copy and imagery for the registration pages. Edit here to swap content without touching layout.
import type { NavItem } from '@/components/home/navbar'
import type { RoleOption } from '@/components/register/role-option-card'
import type { FormCardHeader } from '@/components/register/form-card'
import type { FormFieldConfig } from '@/components/register/form-field'
import type { InfoCalloutContent } from '@/components/register/info-callout'
import type { LocationFieldsContent } from '@/components/register/location-fields'
import { AUTH_LINKS, NAV_ITEMS } from '@/components/home/content'

// The landing page's section anchors, pointed back at the landing page.
export const REGISTER_NAV_ITEMS: NavItem[] = NAV_ITEMS.map(({ href, label }) => ({ href: `/${href}`, label }))

export const REGISTER_STEPS = ['1. Pilih Role', '2. Lengkapi Profil']

export const CHOOSE_ROLE = {
  title: 'Daftar sebagai Apa?',
  subtitle: 'Pilih peran Anda untuk melanjutkan ke proses pendaftaran.',
  roles: [
    {
      href: '/auth/register/nelayan',
      icon: 'fish',
      title: 'Nelayan',
      description: 'Untuk nelayan dan koperasi nelayan yang ingin menjual hasil tangkapan by-catch.',
      image: {
        src: '/images/register/role-nelayan.jpg',
        alt: 'Ilustrasi nelayan mendayung perahu kayu di laut',
      },
    },
    {
      href: '/auth/register?role=pembeli',
      icon: 'factory',
      title: 'Pembeli',
      description:
        'Untuk industri hilir seperti peternak maggot, produsen silase ikan, dan produsen pupuk organik cair.',
      image: {
        src: '/images/register/role-pembeli.jpg',
        alt: 'Ilustrasi fasilitas pengolahan industri dengan truk pengiriman',
      },
    },
  ] satisfies RoleOption[],
  loginQuestion: 'Sudah punya akun?',
  loginLink: { href: AUTH_LINKS.login.href, label: 'Masuk di sini' },
}

export const NELAYAN_PROFILE = {
  title: 'Lengkapi Profil Nelayan',
  subtitle: 'Informasi ini membantu pembeli menemukan hasil tangkapan Anda lebih cepat.',
  card: {
    icon: 'sailboat',
    title: 'Data Diri Nelayan',
    subtitle: 'Kolom bertanda * wajib diisi.',
  } satisfies FormCardHeader,
  nameField: {
    kind: 'text',
    id: 'nama-lengkap',
    label: 'Nama Lengkap',
    icon: 'user',
    placeholder: 'Contoh: Dulmatin',
    required: true,
  } satisfies FormFieldConfig,
  // Options come from lib/wilayah; each list unlocks once the one above it is chosen.
  location: {
    provinsi: { id: 'provinsi', label: 'Provinsi', icon: 'map-pin', placeholder: 'Pilih provinsi' },
    kabKota: {
      id: 'kota',
      label: 'Kota/Kabupaten',
      icon: 'building-2',
      placeholder: 'Pilih kota/kabupaten',
      lockedHelper: 'Pilih provinsi terlebih dahulu.',
    },
    pelabuhan: {
      id: 'ppi',
      label: 'Pangkalan Pendaratan Ikan (PPI)',
      icon: 'anchor',
      placeholder: 'Pilih PPI',
      lockedHelper: 'Pilih kota/kabupaten terlebih dahulu.',
      emptyHelper: 'Belum ada PPI terdaftar di kota/kabupaten ini. Hubungi kami lewat tautan di bawah.',
    },
  } satisfies LocationFieldsContent,
  missingPpi: {
    title: 'PPI saya tidak ada di daftar',
    description: 'Hubungi tim kami untuk menambahkan PPI Anda.',
    href: 'mailto:info@bycatchloop.id',
  } satisfies InfoCalloutContent,
  submitLabel: 'Simpan & lanjut',
}
