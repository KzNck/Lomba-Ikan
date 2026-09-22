'use server'

import { revalidatePath } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import { getKabupatenKota, getPelabuhanById, PROVINSI } from '@/lib/wilayah'
import { infoPribadi, JENIS_USAHA_FIELD, validation, type AccountValues } from '@/components/pembeli/akun-content'
import { saveAccountValues } from '@/lib/pembeli/account'
import { savePreferenceValues, type PreferenceValues } from '@/lib/pembeli/preferences'
import { pembeliPreferensi } from '@/components/register/content'
import { requireProfile } from '@/lib/supabase/auth'

export type AccountFormState = {
  status: 'idle' | 'saved' | 'error'
  // What was submitted, so the form keeps showing it after React resets it.
  values: AccountValues
  errors: Partial<Record<keyof AccountValues, string>>
}

// Indonesian mobile or landline: +62/62/0, then 8–12 more digits. Spaces and dashes are ignored.
const PHONE = /^(\+62|62|0)\d{8,12}$/

// Long enough for "Bu Sri Wahyuni", short enough for the top bar pill and sidebar card.
const NICKNAME_MAX = 24

// Checks and saves the Info Pribadi form. The name and phone go to `profiles`; the business details have no
// columns yet, so they go to the account's user_metadata — see lib/pembeli/account.ts.
export async function saveAccount(previous: AccountFormState, formData: FormData): Promise<AccountFormState> {
  await requireProfile('pembeli')

  const text = (name: keyof AccountValues) => String(formData.get(name) ?? '').trim()
  const values: AccountValues = {
    contactName: text('contactName'),
    nickname: text('nickname'),
    businessName: text('businessName'),
    // The email is locked: keep the account's, whatever was posted.
    email: previous.values.email,
    phone: text('phone'),
    address: text('address'),
    provinsi: text('provinsi'),
    kabKota: text('kabKota'),
    kecamatan: text('kecamatan'),
    kodePos: text('kodePos'),
    jenisUsaha: formData.getAll(JENIS_USAHA_FIELD).map(String),
  }

  const [t, register] = await Promise.all([getTranslations('dashboard.akun'), getTranslations('auth.register')])
  const INFO_PRIBADI = infoPribadi(t, register)
  const { fields } = INFO_PRIBADI
  const VALIDATION = validation(t)
  const errors: AccountFormState['errors'] = {}
  for (const name of ['contactName', 'businessName', 'phone', 'address'] as const) {
    if (!values[name]) errors[name] = VALIDATION.required(fields[name].label)
  }
  if (values.nickname.length > NICKNAME_MAX) errors.nickname = VALIDATION.nickname(NICKNAME_MAX)
  if (values.phone && !PHONE.test(values.phone.replace(/[\s-]/g, ''))) errors.phone = VALIDATION.phone
  if (!PROVINSI.some(({ kode }) => kode === values.provinsi)) errors.provinsi = VALIDATION.choose(INFO_PRIBADI.provinsi.label)
  if (!getKabupatenKota(values.provinsi).some(({ kode }) => kode === values.kabKota)) {
    errors.kabKota = VALIDATION.choose(INFO_PRIBADI.kabKota.label)
  }
  if (values.kodePos && !/^\d{5}$/.test(values.kodePos)) errors.kodePos = VALIDATION.kodePos
  if (values.jenisUsaha.length === 0) errors.jenisUsaha = VALIDATION.jenisUsaha

  if (Object.keys(errors).length > 0) return { status: 'error', values, errors }

  try {
    await saveAccountValues(values)
  } catch (error) {
    return { status: 'error', values, errors: { contactName: (error as Error).message } }
  }

  // The sidebar and top bar print the business name, so they need re-rendering too.
  revalidatePath('/pembeli', 'layout')
  return { status: 'saved', values, errors }
}

export type PreferencesFormState = {
  status: 'idle' | 'saved' | 'error'
  // What was saved (or submitted), so the form keeps showing it after React resets it.
  values: PreferenceValues
  error?: string
}

// Saves the Preferensi section. Every part is optional, as at registration; anything that isn't one of the form's
// own options (or a known PPI) is dropped rather than stored.
export async function savePreferences(_previous: PreferencesFormState, formData: FormData): Promise<PreferencesFormState> {
  await requireProfile('pembeli')

  const PREFERENSI = pembeliPreferensi(await getTranslations('auth.register'))
  const picked = (name: string, allowed: (value: string) => boolean) => [...new Set(formData.getAll(name).map(String))].filter(allowed)
  const materials = new Set<string>(PREFERENSI.jenisBahan.options.map(({ value }) => value))
  const grades = new Set<string>(PREFERENSI.grade.groups.flatMap(({ options }) => options.map(({ value }) => value)))
  const values: PreferenceValues = {
    jenisBahan: picked(PREFERENSI.jenisBahan.name, (value) => materials.has(value)),
    grade: picked(PREFERENSI.grade.name, (value) => grades.has(value)),
    ppiPrioritas: picked(PREFERENSI.ppi.combobox.name, (value) => getPelabuhanById(value) !== undefined),
  }

  try {
    await savePreferenceValues(values)
  } catch (error) {
    return { status: 'error', values, error: (error as Error).message }
  }

  revalidatePath('/pembeli/akun/preferensi')
  return { status: 'saved', values }
}
