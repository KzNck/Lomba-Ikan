// All copy for the nelayan account page (/nelayan/akun). Edit here to swap content without touching layout.
// Text lives in messages/*.json under `dashboard.akun` (shared with the pembeli account page) and `dashboard.akun.nelayan`.
// The account itself is read from Supabase — see lib/nelayan/account.ts. The layout follows the pembeli account page.
import type { FormFieldConfig } from '@/components/register/form-field'
import type { AccountNavItem } from '@/components/pembeli/akun-content'
import { nelayanProfile } from '@/components/register/content'
import type { Translator } from '@/lib/i18n/translator'

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

export type AkunT = Translator<'dashboard.akun'>

export function akunPage(t: AkunT) {
  return {
    title: t('title'),
    subtitle: t('nelayan.subtitle'),
  }
}

// "Sub Navigation". Only Info Pribadi exists so far.
export function akunNav(t: AkunT) {
  return {
    label: t('navLabel'),
    items: [{ href: AKUN_PATH, label: t('personalInfo'), icon: 'user' }] satisfies AccountNavItem[],
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
    // Shown in place of the landing site until one is saved.
    noPpi: t('noPpi'),
  }
}

type TextField = Pick<FormFieldConfig, 'id' | 'label' | 'icon' | 'placeholder' | 'required'> &
  Partial<Pick<FormFieldConfig, 'inputType' | 'inputMode' | 'autoComplete' | 'helper' | 'locked'>>

// `register` is the registration form's copy, whose location selects this form reuses.
export function infoPribadi(t: AkunT, register: Translator<'auth.register'>) {
  const { location } = nelayanProfile(register)
  return {
    title: t('personalInfo'),
    subtitle: t('nelayan.infoSubtitle'),
    fields: {
      fullName: {
        id: 'fullName',
        label: t('fields.fullName'),
        icon: 'user',
        placeholder: t('nelayan.fullNamePlaceholder'),
        required: true,
        autoComplete: 'name',
      },
      nickname: {
        id: 'nickname',
        label: t('fields.nickname'),
        icon: 'message-circle',
        placeholder: t('nelayan.nicknamePlaceholder'),
        autoComplete: 'nickname',
        helper: t('nelayan.nicknameHelper'),
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
      // Required: buyers are sent to this number on WhatsApp once they buy.
      phone: {
        id: 'phone',
        label: t('nelayan.phoneLabel'),
        icon: 'phone',
        required: true,
        placeholder: '+62 812 3456 7890',
        inputType: 'tel',
        inputMode: 'tel',
        autoComplete: 'tel',
        helper: t('nelayan.phoneHelper'),
      },
      bankAccount: {
        id: 'bankAccount',
        label: t('nelayan.bankAccount'),
        icon: 'wallet',
        placeholder: t('nelayan.bankAccountPlaceholder'),
        helper: t('nelayan.bankAccountHelper'),
      },
    } satisfies Record<string, TextField>,
    location: {
      title: t('nelayan.locationTitle'),
      subtitle: t('nelayan.locationSubtitle'),
      // Registration's selects, relabelled in this form's sentence case. The empty-list hint can't point at
      // registration's "PPI saya tidak ada di daftar" link, which isn't on this page, so it gives the address itself.
      provinsi: { ...location.provinsi, id: 'provinsi', label: t('fields.provinsi') },
      kabKota: { ...location.kabKota, id: 'kabKota', label: t('fields.kabKota') },
      pelabuhan: {
        ...location.pelabuhan,
        id: 'ppi',
        label: t('nelayan.ppi'),
        emptyHelper: t('nelayan.ppiEmpty'),
      },
    },
    bank: {
      title: t('nelayan.bankTitle'),
      subtitle: t('nelayan.bankSubtitle'),
    },
    saveLabel: t('save'),
    savingLabel: t('saving'),
    savedMessage: t('saved'),
  }
}

// Messages from the "Validasi gagal" state, checked on save.
export function validation(t: AkunT) {
  return {
    required: (label: string) => t('validation.required', { label: label.toLocaleLowerCase() }),
    provinsi: t('validation.choose', { label: t('fields.provinsi').toLocaleLowerCase() }),
    kabKota: t('validation.choose', { label: t('fields.kabKota').toLocaleLowerCase() }),
    ppi: t('nelayan.choosePpi'),
    phone: t('validation.phone'),
    nickname: (max: number) => t('validation.nickname', { max }),
    // A failed save, shown by the save button rather than on a field: nothing the fisher typed was wrong.
    saveFailed: t('validation.saveFailed'),
  }
}

// "Pindah bagian dengan perubahan belum disimpan".
export function unsavedDialog(t: AkunT) {
  return {
    title: t('unsaved.title'),
    body: t('unsaved.body'),
    discardLabel: t('unsaved.discard'),
    saveLabel: t('unsaved.save'),
  }
}
