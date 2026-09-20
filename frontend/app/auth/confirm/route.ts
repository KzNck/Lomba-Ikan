import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { HOME_BY_ROLE, ensureProfile, safeNext } from '@/lib/supabase/auth'

/**
 * Tujuan tautan konfirmasi di email pendaftaran.
 *
 * Template "Confirm signup" di Supabase harus mengarah ke sini dengan
 * token_hash — lihat README. Token ditukar jadi sesi, row `profiles` dibuat dari
 * user_metadata, lalu user diantar ke dashboard sesuai role-nya.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null

    // URL tujuan dibangun tanpa token, supaya tidak ikut bocor lewat Referer.
    const redirectTo = request.nextUrl.clone()
    redirectTo.search = ''

    if (!tokenHash || !type) {
        redirectTo.pathname = '/auth/login'
        redirectTo.searchParams.set('konfirmasi', 'gagal')
        return NextResponse.redirect(redirectTo)
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })

    if (error || !data.user) {
        redirectTo.pathname = '/auth/login'
        redirectTo.searchParams.set('konfirmasi', 'gagal')
        return NextResponse.redirect(redirectTo)
    }

    const profile = await ensureProfile(data.user)
    redirectTo.pathname = safeNext(searchParams.get('next') ?? undefined, HOME_BY_ROLE[profile.role])
    return NextResponse.redirect(redirectTo)
}
