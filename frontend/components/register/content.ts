// All copy and imagery for the registration pages. Edit here to swap content without touching layout.
import type { NavItem } from '@/components/home/navbar'
import type { RoleOption } from '@/components/register/role-option-card'
import type { PageHeadingProps } from '@/components/register/page-heading'
import type { FormCardHeader } from '@/components/register/form-card'
import type { FormFieldConfig, SelectOption } from '@/components/register/form-field'
import type { InfoCalloutContent } from '@/components/register/info-callout'
import type { LocationFieldsContent } from '@/components/register/location-fields'
import type { ChipGroupContent } from '@/components/register/chip-group'
import type { SubStepProgressContent } from '@/components/register/sub-step-progress'
import type { PreferenceSectionHeader } from '@/components/register/preference-section'
import type { GradeGroupContent } from '@/components/register/grade-group'
import type { PpiComboboxContent } from '@/components/register/ppi-combobox'
import { AUTH_LINKS, NAV_ITEMS } from '@/components/home/content'

// The landing page's section anchors, pointed back at the landing page.
export const REGISTER_NAV_ITEMS: NavItem[] = NAV_ITEMS.map(({ href, label }) => ({ href: `/${href}`, label }))

export const REGISTER_STEPS = ['1. Pilih Role', '2. Lengkapi Profil']

export const CHOOSE_ROLE = {
  heading: {
    title: 'Daftar sebagai Apa?',
    subtitle: 'Pilih peran Anda untuk melanjutkan ke proses pendaftaran.',
  } satisfies PageHeadingProps,
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
      href: '/auth/register/pembeli',
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

// The credentials the account is created with. Kept here so both registration
// forms ask for exactly the same thing in the same words.
export const EMAIL_FIELD = {
  kind: 'text',
  inputType: 'email',
  autoComplete: 'email',
  id: 'email',
  label: 'Email',
  icon: 'mail',
  placeholder: 'Contoh: dulmatin@gmail.com',
  helper: 'Dipakai untuk masuk ke akun Anda.',
  required: true,
} satisfies FormFieldConfig

export const PASSWORD_FIELDS = [
  {
    kind: 'text',
    inputType: 'password',
    autoComplete: 'new-password',
    id: 'password',
    label: 'Password',
    icon: 'lock',
    placeholder: 'Minimal 8 karakter',
    helper: 'Gunakan minimal 8 karakter.',
    required: true,
  },
  {
    kind: 'text',
    inputType: 'password',
    autoComplete: 'new-password',
    id: 'konfirmasi-password',
    label: 'Konfirmasi Password',
    icon: 'lock',
    placeholder: 'Ketik ulang password Anda',
    required: true,
  },
] satisfies FormFieldConfig[]

export const NELAYAN_PROFILE = {
  heading: {
    title: 'Lengkapi Profil Nelayan',
    subtitle: 'Informasi ini membantu pembeli menemukan hasil tangkapan Anda lebih cepat.',
  } satisfies PageHeadingProps,
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
  submitLabel: 'Daftar',
}

// The two-part Pembeli profile: 04a Informasi Usaha, then 04b Preferensi Pencarian.
export const PEMBELI_USAHA = {
  heading: {
    title: 'Informasi Usaha Anda',
    subtitle: 'Lengkapi data usaha Anda agar kami bisa menampilkan pasokan yang sesuai dengan kebutuhan bisnis Anda.',
    variant: 'wrapped',
  } satisfies PageHeadingProps,
  card: {
    icon: 'building-2',
    title: 'Data Usaha',
    subtitle: 'Kolom bertanda * wajib diisi.',
  } satisfies FormCardHeader,
  nameFields: [
    {
      kind: 'text',
      id: 'nama-lengkap',
      label: 'Nama Lengkap',
      icon: 'user',
      placeholder: 'Contoh: Rina Wulandari',
      required: true,
    },
    {
      kind: 'text',
      id: 'nama-usaha',
      label: 'Nama Usaha',
      icon: 'store',
      placeholder: 'Contoh: CV Maggot Sejahtera',
      required: true,
    },
  ] satisfies FormFieldConfig[],
  jenisUsaha: {
    id: 'jenis-usaha',
    label: 'Klasifikasi Jenis Usaha',
    helper: 'Pilih satu atau lebih kategori yang sesuai dengan usaha Anda.',
    required: true,
    options: [
      { value: 'maggot-bsf', label: 'Peternak Maggot BSF' },
      { value: 'silase-ikan', label: 'Produsen Silase Ikan' },
      { value: 'pupuk-organik-cair', label: 'Produsen Pupuk Organik Cair' },
      { value: 'pakan-ternak', label: 'Produsen Pakan Ternak' },
      { value: 'lainnya', label: 'Lainnya' },
    ],
  } satisfies ChipGroupContent,
  emailField: { ...EMAIL_FIELD, placeholder: 'Contoh: rina@usahaanda.co.id' } satisfies FormFieldConfig,
  passwordFields: PASSWORD_FIELDS,
  jenisUsahaError: 'Pilih minimal satu jenis usaha untuk melanjutkan.',
  progress: {
    current: 1,
    total: 2,
    label: 'Bagian 1 dari 2: Informasi usaha',
  } satisfies SubStepProgressContent,
  submitLabel: 'Lanjut',
}

export const PEMBELI_PREFERENSI = {
  heading: {
    title: 'Preferensi Pencarian',
    subtitle: 'Tentukan jenis bahan, grade, dan PPI prioritas agar marketplace langsung menampilkan batch yang relevan.',
    variant: 'wrapped',
  } satisfies PageHeadingProps,
  card: {
    icon: 'sliders-horizontal',
    title: 'Atur Preferensi',
    subtitle: 'Opsional. Anda bisa mengubahnya kapan saja di halaman Akun.',
  } satisfies FormCardHeader,
  jenisBahan: {
    section: {
      icon: 'fish',
      label: 'Jenis Bahan/Tangkapan Dicari',
      helper: 'Pilih satu atau lebih jenis bahan yang Anda cari.',
    } satisfies PreferenceSectionHeader,
    name: 'jenis-bahan',
    options: [
      { value: 'ikan-pelagis', label: 'Ikan Pelagis' },
      { value: 'ikan-demersal', label: 'Ikan Demersal' },
      { value: 'udang', label: 'Udang' },
      { value: 'cumi-cumi', label: 'Cumi-cumi' },
      { value: 'kepiting', label: 'Kepiting' },
      { value: 'rajungan', label: 'Rajungan' },
    ] satisfies SelectOption[],
  },
  grade: {
    section: {
      icon: 'award',
      label: 'Grade Diinginkan',
      helper: 'Pilih grade kesegaran yang sesuai dengan kebutuhan produksi Anda.',
    } satisfies PreferenceSectionHeader,
    name: 'grade',
    groups: [
      {
        tone: 'fresh',
        icon: 'leaf',
        title: 'Hidup (Grade A)',
        options: [
          { value: 'A1', label: 'A1' },
          { value: 'A2', label: 'A2' },
          { value: 'A3', label: 'A3' },
        ],
      },
      {
        tone: 'neutral',
        icon: 'snowflake',
        title: 'Mati (Grade B)',
        options: [
          { value: 'B1', label: 'B1' },
          { value: 'B2', label: 'B2' },
          { value: 'B3', label: 'B3' },
        ],
      },
    ] satisfies GradeGroupContent[],
    disclaimer: 'Grade adalah estimasi kesegaran indikatif, bukan sertifikasi mutu pangan.',
  },
  ppi: {
    section: {
      icon: 'map-pin',
      label: 'PPI Prioritas',
      helper: 'Pilih Pangkalan Pendaratan Ikan (PPI) tempat Anda biasa mengambil pasokan.',
    } satisfies PreferenceSectionHeader,
    // Options come from lib/wilayah (every registered port nationwide).
    combobox: {
      name: 'ppi-prioritas',
      label: 'Cari PPI prioritas',
      placeholder: 'Cari PPI, contoh: PPI Muara Angke',
      emptyTitle: 'Tidak ada PPI dengan nama “{query}”.',
      emptyHint: 'Periksa ejaan, atau tambahkan PPI Anda secara manual.',
      missingPpi: { label: 'PPI saya tidak ada di daftar', href: 'mailto:info@bycatchloop.id' },
      removeLabel: 'Hapus {nama}',
    } satisfies PpiComboboxContent,
  },
  // Submits the registration without preferences; they can be set later in Akun.
  skipLabel: 'Lewati, atur nanti di Akun',
  progress: {
    current: 2,
    total: 2,
    label: 'Bagian 2 dari 2: Preferensi pencarian',
  } satisfies SubStepProgressContent,
  backLabel: 'Kembali',
  submitLabel: 'Daftar',
}
