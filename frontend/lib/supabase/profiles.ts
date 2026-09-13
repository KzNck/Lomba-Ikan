// lib/supabase/profiles.ts
//
// Fungsi terkait profil user + helper auth dasar.

import { supabase } from './client'
import type { Profile, UserRole } from '@/types/database'

export async function getCurrentProfile(): Promise<Profile | null> {
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    if (error) {
        if (error.code === 'PGRST116') return null
        throw new Error(`Gagal ambil profil: ${error.message}`)
    }
    return data
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User belum login')

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

    if (error) throw new Error(`Gagal update profil: ${error.message}`)
    return data
}

/**
 * Sign up + langsung buat row profiles.
 * Dipanggil dari halaman "Masuk / Daftar Akun".
 */
export async function signUp(params: {
    email: string
    password: string
    fullName: string
    role: UserRole
}): Promise<void> {
    const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
    })

    if (error) throw new Error(`Gagal daftar: ${error.message}`)
    if (!data.user) throw new Error('Gagal daftar: user tidak dibuat')

    const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: params.fullName,
        role: params.role,
    })

    if (profileError) throw new Error(`Gagal buat profil: ${profileError.message}`)
}

export async function signIn(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(`Gagal masuk: ${error.message}`)
}

export async function signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(`Gagal keluar: ${error.message}`)
}