'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getLocale, getTranslations } from 'next-intl/server'
import { isLocale } from '@/i18n/config'
import { writeLocaleCookie } from '@/lib/i18n/cookie'
import type { Translator } from '@/lib/i18n/translator'
import {
    HOME_BY_ROLE,
    MIN_PASSWORD_LENGTH,
    ensureProfile,
    getProfile,
    resendConfirmation as resend,
    safeNext,
    signIn,
    signOut as endSession,
    signUp,
    type PendingProfile,
} from '@/lib/supabase/auth'
import { getPelabuhanById } from '@/lib/wilayah'
import { waNumber } from '@/lib/contact/whatsapp'
import type { UserRole } from '@/types/database'

export type AuthFormState = {
    error?: string
    // Dikembalikan supaya form tidak kosong lagi setelah gagal. Password tidak
    // pernah ikut dikembalikan — user mengetik ulang.
    email?: string
    // Diset setelah email konfirmasi berhasil dikirim ulang.
    sent?: boolean
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const text = (formData: FormData, name: string) => String(formData.get(name) ?? '').trim()
const list = (formData: FormData, name: string) => formData.getAll(name).map(String).filter(Boolean)

type ErrorTranslator = Translator<'auth.errors'>

/**
 * Pesan error Supabase (bahasa Inggris, kadang teknis) diterjemahkan ke kalimat
 * yang berguna buat user, dalam bahasa yang sedang aktif. Sisanya diteruskan apa
 * adanya supaya masalah tak terduga tetap kelihatan alih-alih tersembunyi di balik
 * pesan umum.
 */
function readableError(t: ErrorTranslator, message: string): string {
    const lower = message.toLowerCase()
    if (lower.includes('invalid login credentials')) return t('invalidCredentials')
    if (lower.includes('already registered') || lower.includes('already exists')) return t('alreadyRegistered')
    if (lower.includes('password') && lower.includes('at least')) return t('passwordTooShort', { min: MIN_PASSWORD_LENGTH })
    if (lower.includes('rate limit') || lower.includes('too many') || lower.includes('security purposes')) {
        return t('rateLimited')
    }
    if (lower.includes('invalid') && lower.includes('email')) return t('invalidEmail')
    return message
}

/** Validasi email + password yang sama-sama dipakai kedua form registrasi. */
function checkCredentials(t: ErrorTranslator, email: string, password: string, confirmation: string): string | undefined {
    if (!EMAIL.test(email)) return t('enterValidEmail')
    if (password.length < MIN_PASSWORD_LENGTH) return t('passwordTooShort', { min: MIN_PASSWORD_LENGTH })
    if (password !== confirmation) return t('passwordMismatch')
}

/** URL absolut tujuan tautan konfirmasi email, dari host permintaan ini. */
async function confirmUrl(next: string): Promise<string> {
    const head = await headers()
    const host = head.get('x-forwarded-host') ?? head.get('host') ?? 'localhost:3000'
    const protocol = head.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
    return `${protocol}://${host}/auth/confirm?next=${encodeURIComponent(next)}`
}

/** Masuk dengan email + password. */
export async function login(_previous: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const email = text(formData, 'email')
    const password = String(formData.get('password') ?? '')
    const t = await getTranslations('auth.errors')

    if (!EMAIL.test(email)) return { error: t('enterValidEmail'), email }
    if (!password) return { error: t('enterPassword'), email }

    let role: UserRole
    try {
        const user = await signIn(email, password)
        // The language this account last chose (app/locale-actions.ts) follows it to this device.
        const saved = user.user_metadata?.locale
        if (isLocale(saved)) await writeLocaleCookie(saved)
        // Registrasi menitipkan profil di user_metadata; di sinilah row-nya dibuat
        // kalau konfirmasi email belum sempat membuatnya.
        role = (await ensureProfile(user)).role
    } catch (error) {
        const message = (error as Error).message
        // Akunnya benar, cuma belum dikonfirmasi: antar ke halaman yang bisa
        // mengirim ulang tautannya, bukan pesan error yang buntu.
        if (message.toLowerCase().includes('email not confirmed')) {
            redirect(`/auth/daftar/konfirmasi?email=${encodeURIComponent(email)}`)
        }
        return { error: readableError(t, message), email }
    }

    revalidatePath('/', 'layout')
    redirect(safeNext(text(formData, 'next') || undefined, HOME_BY_ROLE[role]))
}

/**
 * Selesaikan registrasi: buat akun, lalu masuk kalau sesinya langsung terbentuk.
 * Kalau project mewajibkan konfirmasi email, `session` kosong dan user diarahkan
 * ke halaman "cek email".
 */
async function completeSignUp(
    email: string,
    password: string,
    pending: PendingProfile
): Promise<AuthFormState> {
    const home = HOME_BY_ROLE[pending.role]
    const t = await getTranslations('auth.errors')

    let hasSession: boolean
    try {
        // The language the account signed up in becomes its saved choice.
        const data = await signUp({
            email,
            password,
            pending: { ...pending, locale: await getLocale() },
            confirmUrl: await confirmUrl(home),
        })
        hasSession = Boolean(data.session)
        if (data.session && data.user) await ensureProfile(data.user)
    } catch (error) {
        return { error: readableError(t, (error as Error).message), email }
    }

    revalidatePath('/', 'layout')
    redirect(hasSession ? home : `/auth/daftar/konfirmasi?email=${encodeURIComponent(email)}`)
}

/** Registrasi nelayan. */
export async function registerNelayan(_previous: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const email = text(formData, 'email')
    const fullName = text(formData, 'nama-lengkap')
    const ppiId = text(formData, 'ppi')
    const phone = text(formData, 'telepon')
    const t = await getTranslations('auth.errors')

    if (!fullName) return { error: t('fullNameRequired'), email }
    // Pembeli dikirim ke nomor ini lewat WhatsApp setelah membeli.
    if (!waNumber(phone)) return { error: t('phoneRequired'), email }
    if (!ppiId) return { error: t('ppiRequired'), email }

    const invalid = checkCredentials(t, email, String(formData.get('password') ?? ''), String(formData.get('konfirmasi-password') ?? ''))
    if (invalid) return { error: invalid, email }

    return completeSignUp(email, String(formData.get('password') ?? ''), {
        role: 'nelayan',
        full_name: fullName,
        phone,
        // Disimpan sebagai nama, bukan kode, supaya listing bisa menampilkannya apa adanya.
        ppi_location: getPelabuhanById(ppiId)?.nama ?? ppiId,
    })
}

/** Registrasi pembeli: bagian 1 (usaha) dan 2 (preferensi) dikirim sekaligus di submit terakhir. */
export async function registerPembeli(_previous: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const email = text(formData, 'email')
    const fullName = text(formData, 'nama-lengkap')
    const businessName = text(formData, 'nama-usaha')
    const jenisUsaha = list(formData, 'jenis-usaha')
    const t = await getTranslations('auth.errors')

    if (!fullName) return { error: t('fullNameRequired'), email }
    if (!businessName) return { error: t('businessNameRequired'), email }
    if (jenisUsaha.length === 0) return { error: t('businessTypeRequired'), email }

    const invalid = checkCredentials(t, email, String(formData.get('password') ?? ''), String(formData.get('konfirmasi-password') ?? ''))
    if (invalid) return { error: invalid, email }

    // "Lewati" mengirim tanda ini: preferensi yang sempat dicentang tidak ikut disimpan.
    const skipped = formData.get('lewati') !== null
    const ppiPrioritas = skipped ? [] : list(formData, 'ppi-prioritas')

    return completeSignUp(email, String(formData.get('password') ?? ''), {
        role: 'pembeli',
        full_name: fullName,
        business_name: businessName,
        jenis_usaha: jenisUsaha,
        // Preferensi opsional — kosong kalau user menekan "Lewati".
        jenis_bahan: skipped ? [] : list(formData, 'jenis-bahan'),
        grade: skipped ? [] : list(formData, 'grade'),
        ppi_prioritas: ppiPrioritas,
        ppi_location: ppiPrioritas.map((id) => getPelabuhanById(id)?.nama ?? id)[0],
    })
}

/** Kirim ulang tautan konfirmasi dari halaman "Konfirmasi Email Anda". */
export async function resendConfirmation(
    _previous: AuthFormState,
    formData: FormData
): Promise<AuthFormState> {
    const email = text(formData, 'email')
    const t = await getTranslations('auth.errors')
    if (!EMAIL.test(email)) return { error: t('invalidEmail'), email }

    try {
        await resend(email, await confirmUrl('/'))
    } catch (error) {
        return { error: readableError(t, (error as Error).message), email }
    }
    return { email, sent: true }
}

export async function signOut(): Promise<void> {
    await endSession()
    revalidatePath('/', 'layout')
    redirect('/auth/login')
}

/** Dipakai halaman auth untuk mengarahkan user yang sudah login. */
export async function homeForCurrentUser(): Promise<string | null> {
    const profile = await getProfile()
    return profile ? HOME_BY_ROLE[profile.role] : null
}
