// All copy for the pembeli account page (/pembeli/akun). Edit here to swap content without touching layout.
// Text lives in messages/*.json under `dashboard.akun` (shared with the nelayan account page) and `dashboard.akun.pembeli`.
// The account itself is read from Supabase — see lib/pembeli/account.ts.
import type { IconName } from '@/components/ui/icon'
import type { FormFieldConfig } from '@/components/register/form-field'
import { pembeliUsaha } from '@/components/register/content'
import type { AkunT } from '@/components/nelayan/akun-content'
import type { Translator } from '@/lib/i18n/translator'

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

export function akunPage(t: AkunT) {
  return {
    title: t('title'),
    subtitle: t('pembeli.subtitle'),
  }
}

export type AccountNavItem = { href: string; label: string; icon: IconName }

// "Sub Navigation": Info Pribadi and Preferensi. (The design's Notifikasi section is left out.)
export function akunNav(t: AkunT) {
  return {
    label: t('navLabel'),
    items: [
      { href: AKUN_PATH, label: t('personalInfo'), icon: 'user' },
      { href: `${AKUN_PATH}/preferensi`, label: t('preferences'), icon: 'sliders-horizontal' },
    ] satisfies AccountNavItem[],
    signOutLabel: t('signOut'),
  }
}

export function profileHeader(t: AkunT, roleLabel: string) {
  return {
    roleLabel,
    changePhoto: {
      label: t('changePhoto'),
      pending: t('changePhotoPending'),
      saved: t('changePhotoSaved'),
      invalid: t('changePhotoInvalid'),
      failed: t('changePhotoFailed'),
    },
  }
}

type TextField = Pick<FormFieldConfig, 'id' | 'label' | 'icon' | 'placeholder' | 'required'> &
  Partial<Pick<FormFieldConfig, 'inputType' | 'inputMode' | 'autoComplete' | 'helper' | 'locked'>>

type SelectField = Pick<FormFieldConfig, 'id' | 'label' | 'icon' | 'placeholder'>

// `register` is the registration form's copy, whose business-type chips this form reuses.
export function infoPribadi(t: AkunT, register: Translator<'auth.register'>) {
  return {
    title: t('personalInfo'),
    subtitle: t('pembeli.infoSubtitle'),
    fields: {
      contactName: {
        id: 'contactName',
        label: t('fields.fullName'),
        icon: 'user',
        placeholder: t('pembeli.contactNamePlaceholder'),
        required: true,
        autoComplete: 'name',
      },
      nickname: {
        id: 'nickname',
        label: t('fields.nickname'),
        icon: 'message-circle',
        placeholder: t('pembeli.nicknamePlaceholder'),
        autoComplete: 'nickname',
        helper: t('pembeli.nicknameHelper'),
      },
      businessName: {
        id: 'businessName',
        label: t('pembeli.businessName'),
        icon: 'building-2',
        placeholder: t('pembeli.businessNamePlaceholder'),
        required: true,
        autoComplete: 'organization',
      },
      email: {
        id: 'email',
        label: t('fields.email'),
        icon: 'mail',
        placeholder: '',
        required: true,
        inputType: 'email',
        locked: true,
        helper: t('fields.emailHelper'),
      },
      phone: {
        id: 'phone',
        label: t('fields.phone'),
        icon: 'phone',
        placeholder: '+62 812 3456 7890',
        required: true,
        inputType: 'tel',
        inputMode: 'tel',
        autoComplete: 'tel',
      },
      address: {
        id: 'address',
        label: t('pembeli.address'),
        icon: 'map-pin',
        placeholder: t('pembeli.addressPlaceholder'),
        required: true,
        autoComplete: 'street-address',
      },
      // Free text for now: there's no kecamatan list in lib/wilayah to drive a dropdown like the design's.
      kecamatan: { id: 'kecamatan', label: t('pembeli.kecamatan'), icon: 'signpost', placeholder: t('pembeli.kecamatanPlaceholder') },
      kodePos: {
        id: 'kodePos',
        label: t('pembeli.kodePos'),
        icon: 'mailbox',
        placeholder: '60185',
        inputMode: 'numeric',
        autoComplete: 'postal-code',
      },
    } satisfies Record<string, TextField>,
    provinsi: { id: 'provinsi', label: t('fields.provinsi'), icon: 'map', placeholder: t('fields.provinsiPlaceholder') } satisfies SelectField,
    kabKota: {
      id: 'kabKota',
      label: t('fields.kabKota'),
      icon: 'building',
      placeholder: t('fields.kabKotaPlaceholder'),
      lockedHelper: t('fields.kabKotaLocked'),
    } satisfies SelectField & { lockedHelper: string },
    jenisUsaha: {
      ...pembeliUsaha(register).jenisUsaha,
      label: t('pembeli.businessType'),
      helper: t('pembeli.businessTypeHelper'),
    },
    saveLabel: t('save'),
    savingLabel: t('saving'),
    savedMessage: t('saved'),
  }
}

// The field id of the business-type chips, which the action reads without the rest of the copy.
export const JENIS_USAHA_FIELD = 'jenis-usaha'

// Messages from the "Validasi gagal" state, checked on save.
export function validation(t: AkunT) {
  return {
    required: (label: string) => t('validation.required', { label: label.toLocaleLowerCase() }),
    choose: (label: string) => t('validation.choose', { label: label.toLocaleLowerCase() }),
    phone: t('validation.phone'),
    nickname: (max: number) => t('validation.nickname', { max }),
    kodePos: t('pembeli.kodePosError'),
    jenisUsaha: t('pembeli.businessTypeError'),
  }
}

// "Pindah bagian dengan perubahan belum disimpan".
export { unsavedDialog } from '@/components/nelayan/akun-content'
