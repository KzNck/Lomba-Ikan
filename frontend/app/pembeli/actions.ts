'use server'

import { redirect } from 'next/navigation'
import { getKabupatenKota, PROVINSI } from '@/lib/wilayah'
import { INFO_PRIBADI, VALIDATION, type AccountValues } from '@/components/pembeli/akun-content'

// Stand-in for saving the registration: until Supabase handles it, finishing the form lands on the dashboard.
export async function enterPembeliDashboard() {
  redirect('/pembeli')
}

export type AccountFormState = {
  status: 'idle' | 'saved' | 'error'
  // What was submitted, so the form keeps showing it after React resets it.
  values: AccountValues
  errors: Partial<Record<keyof AccountValues, string>>
}

// Indonesian mobile or landline: +62/62/0, then 8–12 more digits. Spaces and dashes are ignored.
const PHONE = /^(\+62|62|0)\d{8,12}$/

// Checks and "saves" the Info Pribadi form. Until the account lives in Supabase nothing is stored: a valid form
// returns "saved" and the page shows the sample profile again on reload.
export async function saveAccount(previous: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const text = (name: keyof AccountValues) => String(formData.get(name) ?? '').trim()
  const values: AccountValues = {
    contactName: text('contactName'),
    businessName: text('businessName'),
    // The email is locked: keep the account's, whatever was posted.
    email: previous.values.email,
    phone: text('phone'),
    address: text('address'),
    provinsi: text('provinsi'),
    kabKota: text('kabKota'),
    kecamatan: text('kecamatan'),
    kodePos: text('kodePos'),
    jenisUsaha: formData.getAll(INFO_PRIBADI.jenisUsaha.id).map(String),
  }

  const { fields } = INFO_PRIBADI
  const errors: AccountFormState['errors'] = {}
  for (const name of ['contactName', 'businessName', 'phone', 'address'] as const) {
    if (!values[name]) errors[name] = VALIDATION.required(fields[name].label)
  }
  if (values.phone && !PHONE.test(values.phone.replace(/[\s-]/g, ''))) errors.phone = VALIDATION.phone
  if (!PROVINSI.some(({ kode }) => kode === values.provinsi)) errors.provinsi = VALIDATION.choose(INFO_PRIBADI.provinsi.label)
  if (!getKabupatenKota(values.provinsi).some(({ kode }) => kode === values.kabKota)) {
    errors.kabKota = VALIDATION.choose(INFO_PRIBADI.kabKota.label)
  }
  if (values.kodePos && !/^\d{5}$/.test(values.kodePos)) errors.kodePos = VALIDATION.kodePos
  if (values.jenisUsaha.length === 0) errors.jenisUsaha = VALIDATION.jenisUsaha

  return { status: Object.keys(errors).length > 0 ? 'error' : 'saved', values, errors }
}

// Stand-in for signing out: until Supabase sessions are wired up, it goes back to the login page.
export async function signOut() {
  redirect('/auth/login')
}
