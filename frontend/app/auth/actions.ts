'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
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

/**
 * Pesan error Supabase (bahasa Inggris, kadang teknis) diterjemahkan ke kalimat
 * yang berguna buat user. Sisanya diteruskan apa adanya supaya masalah tak
 * terduga tetap kelihatan alih-alih tersembunyi di balik pesan umum.
 */
function readableError(message: string): string {
    const lower = message.toLowerCase()
    if (lower.includes('invalid login credentials')) {
        return 'Email atau password salah. Periksa lagi, lalu coba masuk kembali.'
    }
    if (lower.includes('already registered') || lower.includes('already exists')) {
        return 'Email ini sudah terdaftar. Silakan masuk.'
    }
    if (lower.includes('password') && lower.includes('at least')) {
        return `Password minimal ${MIN_PASSWORD_LENGTH} karakter.`
    }
    if (lower.includes('rate limit') || lower.includes('too many') || lower.includes('security purposes')) {
        return 'Terlalu banyak percobaan. Tunggu sebentar sebelum mencoba lagi.'
    }
    if (lower.includes('invalid') && lower.includes('email')) return 'Alamat email tidak valid.'
    return message
}

/** Validasi email + password yang sama-sama dipakai kedua form registrasi. */
function checkCredentials(email: string, password: string, confirmation: string): string | undefined {
    if (!EMAIL.test(email)) return 'Masukkan alamat email yang valid.'
    if (password.length < MIN_PASSWORD_LENGTH) return `Password minimal ${MIN_PASSWORD_LENGTH} karakter.`
    if (password !== confirmation) return 'Konfirmasi password belum sama dengan password.'
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

    if (!EMAIL.test(email)) return { error: 'Masukkan alamat email yang valid.', email }
    if (!password) return { error: 'Masukkan password Anda.', email }

    let role: UserRole
    try {
        const user = await signIn(email, password)
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
        return { error: readableError(message), email }
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

    let hasSession: boolean
    try {
        const data = await signUp({ email, password, pending, confirmUrl: await confirmUrl(home) })
        hasSession = Boolean(data.session)
        if (data.session && data.user) await ensureProfile(data.user)
    } catch (error) {
        return { error: readableError((error as Error).message), email }
    }

    revalidatePath('/', 'layout')
    redirect(hasSession ? home : `/auth/daftar/konfirmasi?email=${encodeURIComponent(email)}`)
}

/** Registrasi nelayan. */
export async function registerNelayan(_previous: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const email = text(formData, 'email')
    const fullName = text(formData, 'nama-lengkap')
    const ppiId = text(formData, 'ppi')

    if (!fullName) return { error: 'Nama lengkap wajib diisi.', email }
    if (!ppiId) return { error: 'Pilih Pangkalan Pendaratan Ikan (PPI) Anda.', email }

    const invalid = checkCredentials(email, String(formData.get('password') ?? ''), String(formData.get('konfirmasi-password') ?? ''))
    if (invalid) return { error: invalid, email }

    return completeSignUp(email, String(formData.get('password') ?? ''), {
        role: 'nelayan',
        full_name: fullName,
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

    if (!fullName) return { error: 'Nama lengkap wajib diisi.', email }
    if (!businessName) return { error: 'Nama usaha wajib diisi.', email }
    if (jenisUsaha.length === 0) return { error: 'Pilih minimal satu jenis usaha.', email }

    const invalid = checkCredentials(email, String(formData.get('password') ?? ''), String(formData.get('konfirmasi-password') ?? ''))
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
    if (!EMAIL.test(email)) return { error: 'Alamat email tidak valid.', email }

    try {
        await resend(email, await confirmUrl('/'))
    } catch (error) {
        return { error: readableError((error as Error).message), email }
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
