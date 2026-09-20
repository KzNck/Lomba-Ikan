// lib/supabase/auth.ts
//
// Helper auth sisi server. Masuk memakai email + password.
//
// Data profil yang diisi saat registrasi dititipkan ke `user_metadata` lewat
// `signUp`, lalu dipindahkan ke tabel `profiles` begitu sesinya terbentuk
// (lihat `ensureProfile`). Kalau konfirmasi email menyala di project Supabase,
// sesi baru ada setelah tautan konfirmasi diklik — row profil dibuat saat itu,
// atau saat login pertama. Dengan begitu registrasi tidak perlu menyimpan draft
// di server sebelum user-nya benar-benar ada.

import { redirect } from 'next/navigation'
import type { AuthResponse, User } from '@supabase/supabase-js'
import { createClient } from './server'
import type { Profile, UserRole } from '@/types/database'

/** Halaman utama tiap role — dipakai setelah login dan oleh proxy. */
export const HOME_BY_ROLE: Record<UserRole, string> = {
    nelayan: '/nelayan',
    pembeli: '/pembeli',
    admin: '/nelayan',
}

/** Panjang minimum password. Supabase default-nya 6; di sini dinaikkan sedikit. */
export const MIN_PASSWORD_LENGTH = 8

/**
 * Data profil yang dikumpulkan form registrasi. Disimpan sementara di
 * `user_metadata`; `full_name` dan `role` pindah ke kolom `profiles`, sisanya
 * menunggu kolomnya ada (lihat README).
 */
export type PendingProfile = {
    role: UserRole
    full_name: string
    ppi_location?: string
    phone?: string
    business_name?: string
    jenis_usaha?: string[]
    jenis_bahan?: string[]
    grade?: string[]
    ppi_prioritas?: string[]
}

/** User yang sedang login, atau null. Memakai getUser() — token diverifikasi ke server Supabase. */
export async function getUser(): Promise<User | null> {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    return user
}

/**
 * Profil user yang sedang login. `null` kalau belum login, atau kalau row
 * `profiles`-nya belum sempat dibuat.
 */
export async function getProfile(): Promise<Profile | null> {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
    if (error) throw new Error(`Gagal ambil profil: ${error.message}`)
    return data
}

/**
 * Buat akun baru. Profil yang diisi di form dititipkan ke `user_metadata`.
 *
 * `session` null berarti project-nya mewajibkan konfirmasi email: akunnya sudah
 * dibuat tapi belum bisa dipakai sampai tautan di email diklik.
 */
export async function signUp(params: {
    email: string
    password: string
    pending: PendingProfile
    // Tujuan tautan konfirmasi di email.
    confirmUrl: string
}): Promise<AuthResponse['data']> {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
            data: params.pending as Record<string, unknown>,
            emailRedirectTo: params.confirmUrl,
        },
    })
    if (error) throw new Error(error.message)
    return data
}

/**
 * Kirim ulang email konfirmasi pendaftaran. Hanya berlaku untuk akun yang sudah
 * pernah mendaftar dan belum dikonfirmasi; Supabase membatasi frekuensinya.
 */
export async function resendConfirmation(email: string, confirmUrl: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: confirmUrl },
    })
    if (error) throw new Error(error.message)
}

export async function signIn(email: string, password: string): Promise<User> {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('Gagal masuk: sesi tidak terbentuk.')
    return data.user
}

/**
 * Pastikan row `profiles` ada untuk user yang baru masuk, diisi dari
 * `user_metadata` yang dititipkan saat registrasi. Aman dipanggil berulang:
 * kalau profil sudah ada, row-nya langsung dikembalikan tanpa ditimpa.
 */
export async function ensureProfile(user: User): Promise<Profile> {
    const supabase = await createClient()

    const { data: existing, error: readError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
    if (readError) throw new Error(`Gagal ambil profil: ${readError.message}`)
    if (existing) return existing

    const meta = (user.user_metadata ?? {}) as Partial<PendingProfile>
    const { data, error } = await supabase
        .from('profiles')
        .insert({
            id: user.id,
            // Fallback ke bagian depan email supaya kolom NOT NULL tidak pernah kosong.
            full_name: meta.full_name?.trim() || user.email?.split('@')[0] || 'Pengguna',
            role: meta.role ?? 'nelayan',
            ppi_location: meta.ppi_location ?? null,
            phone: meta.phone ?? null,
        })
        .select()
        .single()

    if (error) throw new Error(`Gagal buat profil: ${error.message}`)
    return data
}

/**
 * Profil untuk halaman yang wajib login. Tanpa sesi → ke halaman login; kalau
 * role-nya tidak cocok → ke dashboard miliknya sendiri, bukan halaman error,
 * karena user tidak salah apa-apa, cuma salah alamat.
 */
export async function requireProfile(role?: UserRole): Promise<Profile> {
    const profile = await getProfile()
    if (!profile) redirect('/auth/login')
    if (role && profile.role !== role && profile.role !== 'admin') {
        redirect(HOME_BY_ROLE[profile.role])
    }
    return profile
}

/**
 * Tujuan aman setelah login: hanya path internal. Mencegah `?next=` dipakai
 * untuk mengarahkan user ke situs lain setelah berhasil masuk.
 */
export function safeNext(next: string | undefined, fallback: string): string {
    if (!next) return fallback
    // "//evil.com" dan "/\evil.com" dibaca browser sebagai host lain, bukan path.
    if (!next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return fallback
    return next
}

export async function signOut(): Promise<void> {
    const supabase = await createClient()
    await supabase.auth.signOut()
}
