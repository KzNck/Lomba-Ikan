// All copy and imagery for the registration pages. Edit here to swap content without touching layout.
// Text lives in messages/*.json under `auth.register`; this file pairs it with ids, icons, images and links.
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
import { AUTH_HREFS, navItems } from '@/components/home/content'
import type { Translator } from '@/lib/i18n/translator'

type RegisterT = Translator<'auth.register'>

// The landing page's section anchors, pointed back at the landing page.
export function registerNavItems(t: Translator<'landing'>): NavItem[] {
  return navItems(t).map(({ href, label }) => ({ href: `/${href}`, label }))
}

export function registerSteps(t: RegisterT) {
  return [t('steps.role'), t('steps.profile')]
}

export function chooseRole(t: RegisterT) {
  return {
    heading: {
      title: t('chooseRole.title'),
      subtitle: t('chooseRole.subtitle'),
    } satisfies PageHeadingProps,
    roles: [
      {
        href: '/auth/register/nelayan',
        icon: 'fish',
        title: t('chooseRole.nelayan.title'),
        description: t('chooseRole.nelayan.description'),
        image: {
          src: '/images/register/role-nelayan.jpg',
          alt: t('chooseRole.nelayan.imageAlt'),
        },
      },
      {
        href: '/auth/register/pembeli',
        icon: 'factory',
        title: t('chooseRole.pembeli.title'),
        description: t('chooseRole.pembeli.description'),
        image: {
          src: '/images/register/role-pembeli.jpg',
          alt: t('chooseRole.pembeli.imageAlt'),
        },
      },
    ] satisfies RoleOption[],
    loginQuestion: t('chooseRole.loginQuestion'),
    loginLink: { href: AUTH_HREFS.login, label: t('chooseRole.loginLink') },
  }
}

// The credentials the account is created with. Kept here so both registration
// forms ask for exactly the same thing in the same words.
export function emailField(t: RegisterT) {
  return {
    kind: 'text',
    inputType: 'email',
    autoComplete: 'email',
    id: 'email',
    label: t('fields.emailLabel'),
    icon: 'mail',
    placeholder: t('fields.emailPlaceholder'),
    helper: t('fields.emailHelper'),
    required: true,
  } satisfies FormFieldConfig
}

export function passwordFields(t: RegisterT) {
  return [
    {
      kind: 'text',
      inputType: 'password',
      autoComplete: 'new-password',
      id: 'password',
      label: t('fields.passwordLabel'),
      icon: 'lock',
      placeholder: t('fields.passwordPlaceholder'),
      helper: t('fields.passwordHelper'),
      required: true,
    },
    {
      kind: 'text',
      inputType: 'password',
      autoComplete: 'new-password',
      id: 'konfirmasi-password',
      label: t('fields.confirmPasswordLabel'),
      icon: 'lock',
      placeholder: t('fields.confirmPasswordPlaceholder'),
      required: true,
    },
  ] satisfies FormFieldConfig[]
}

export function nelayanProfile(t: RegisterT) {
  return {
    heading: {
      title: t('nelayan.title'),
      subtitle: t('nelayan.subtitle'),
    } satisfies PageHeadingProps,
    card: {
      icon: 'sailboat',
      title: t('nelayan.cardTitle'),
      subtitle: t('fields.requiredNote'),
    } satisfies FormCardHeader,
    nameField: {
      kind: 'text',
      id: 'nama-lengkap',
      label: t('fields.fullNameLabel'),
      icon: 'user',
      placeholder: t('nelayan.namePlaceholder'),
      required: true,
    } satisfies FormFieldConfig,
    // Options come from lib/wilayah; each list unlocks once the one above it is chosen.
    location: {
      provinsi: { id: 'provinsi', label: t('location.provinsiLabel'), icon: 'map-pin', placeholder: t('location.provinsiPlaceholder') },
      kabKota: {
        id: 'kota',
        label: t('location.kabKotaLabel'),
        icon: 'building-2',
        placeholder: t('location.kabKotaPlaceholder'),
        lockedHelper: t('location.kabKotaLocked'),
      },
      pelabuhan: {
        id: 'ppi',
        label: t('location.pelabuhanLabel'),
        icon: 'anchor',
        placeholder: t('location.pelabuhanPlaceholder'),
        lockedHelper: t('location.pelabuhanLocked'),
        emptyHelper: t('location.pelabuhanEmpty'),
      },
    } satisfies LocationFieldsContent,
    missingPpi: {
      title: t('nelayan.missingPpiTitle'),
      description: t('nelayan.missingPpiDescription'),
      href: 'mailto:info@bycatchloop.id',
    } satisfies InfoCalloutContent,
    submitLabel: t('nelayan.submit'),
  }
}

const BUSINESS_TYPES = ['maggot-bsf', 'silase-ikan', 'pupuk-organik-cair', 'pakan-ternak', 'lainnya'] as const
const MATERIALS = ['ikan-pelagis', 'ikan-demersal', 'udang', 'cumi-cumi', 'kepiting', 'rajungan'] as const

// The two-part Pembeli profile: 04a Informasi Usaha, then 04b Preferensi Pencarian.
export function pembeliUsaha(t: RegisterT) {
  return {
    heading: {
      title: t('pembeliUsaha.title'),
      subtitle: t('pembeliUsaha.subtitle'),
      variant: 'wrapped',
    } satisfies PageHeadingProps,
    card: {
      icon: 'building-2',
      title: t('pembeliUsaha.cardTitle'),
      subtitle: t('fields.requiredNote'),
    } satisfies FormCardHeader,
    nameFields: [
      {
        kind: 'text',
        id: 'nama-lengkap',
        label: t('fields.fullNameLabel'),
        icon: 'user',
        placeholder: t('pembeliUsaha.namePlaceholder'),
        required: true,
      },
      {
        kind: 'text',
        id: 'nama-usaha',
        label: t('pembeliUsaha.businessNameLabel'),
        icon: 'store',
        placeholder: t('pembeliUsaha.businessNamePlaceholder'),
        required: true,
      },
    ] satisfies FormFieldConfig[],
    jenisUsaha: {
      id: 'jenis-usaha',
      label: t('pembeliUsaha.businessTypeLabel'),
      helper: t('pembeliUsaha.businessTypeHelper'),
      required: true,
      options: BUSINESS_TYPES.map((value) => ({ value, label: t(`pembeliUsaha.businessTypes.${value}`) })),
    } satisfies ChipGroupContent,
    emailField: { ...emailField(t), placeholder: t('pembeliUsaha.emailPlaceholder') } satisfies FormFieldConfig,
    passwordFields: passwordFields(t),
    jenisUsahaError: t('pembeliUsaha.businessTypeError'),
    progress: {
      current: 1,
      total: 2,
      label: t('pembeliUsaha.progress'),
    } satisfies SubStepProgressContent,
    submitLabel: t('pembeliUsaha.submit'),
  }
}

export function pembeliPreferensi(t: RegisterT) {
  return {
    heading: {
      title: t('pembeliPreferensi.title'),
      subtitle: t('pembeliPreferensi.subtitle'),
      variant: 'wrapped',
    } satisfies PageHeadingProps,
    card: {
      icon: 'sliders-horizontal',
      title: t('pembeliPreferensi.cardTitle'),
      subtitle: t('pembeliPreferensi.cardSubtitle'),
    } satisfies FormCardHeader,
    jenisBahan: {
      section: {
        icon: 'fish',
        label: t('pembeliPreferensi.materialLabel'),
        helper: t('pembeliPreferensi.materialHelper'),
      } satisfies PreferenceSectionHeader,
      name: 'jenis-bahan',
      options: MATERIALS.map((value) => ({ value, label: t(`pembeliPreferensi.materials.${value}`) })) satisfies SelectOption[],
    },
    grade: {
      section: {
        icon: 'award',
        label: t('pembeliPreferensi.gradeLabel'),
        helper: t('pembeliPreferensi.gradeHelper'),
      } satisfies PreferenceSectionHeader,
      name: 'grade',
      groups: [
        {
          tone: 'fresh',
          icon: 'leaf',
          title: t('pembeliPreferensi.gradeLive'),
          options: [
            { value: 'A1', label: 'A1' },
            { value: 'A2', label: 'A2' },
            { value: 'A3', label: 'A3' },
          ],
        },
        {
          tone: 'neutral',
          icon: 'snowflake',
          title: t('pembeliPreferensi.gradeDead'),
          options: [
            { value: 'B1', label: 'B1' },
            { value: 'B2', label: 'B2' },
            { value: 'B3', label: 'B3' },
          ],
        },
      ] satisfies GradeGroupContent[],
      disclaimer: t('pembeliPreferensi.gradeDisclaimer'),
    },
    ppi: {
      section: {
        icon: 'map-pin',
        label: t('pembeliPreferensi.ppiLabel'),
        helper: t('pembeliPreferensi.ppiHelper'),
      } satisfies PreferenceSectionHeader,
      // Options come from lib/wilayah (every registered port nationwide).
      combobox: {
        name: 'ppi-prioritas',
        label: t('pembeliPreferensi.ppiSearchLabel'),
        placeholder: t('pembeliPreferensi.ppiSearchPlaceholder'),
        // The combobox fills in "{query}" and "{nama}" itself, so those stay as literal placeholders here.
        emptyTitle: t('pembeliPreferensi.ppiEmptyTitle', { query: '{query}' }),
        emptyHint: t('pembeliPreferensi.ppiEmptyHint'),
        missingPpi: { label: t('pembeliPreferensi.ppiMissing'), href: 'mailto:info@bycatchloop.id' },
        removeLabel: t('pembeliPreferensi.ppiRemove', { name: '{nama}' }),
      } satisfies PpiComboboxContent,
    },
    // Submits the registration without preferences; they can be set later in Akun.
    skipLabel: t('pembeliPreferensi.skip'),
    progress: {
      current: 2,
      total: 2,
      label: t('pembeliPreferensi.progress'),
    } satisfies SubStepProgressContent,
    backLabel: t('pembeliPreferensi.back'),
    submitLabel: t('pembeliPreferensi.submit'),
    submittingLabel: t('pembeliPreferensi.submitting'),
  }
}
