import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { HOME_BY_ROLE, ensureProfile, safeNext } from '@/lib/supabase/auth'

/**
 * Tujuan tautan di email dari Supabase: konfirmasi pendaftaran dan reset password.
 *
 * Template di README mengarah ke sini dengan token_hash (+ `type`: email atau recovery), yang ditukar jadi sesi.
 * Template bawaan Supabase lewat endpoint-nya sendiri lalu kembali dengan `code` (PKCE); itu juga diterima, supaya
 * reset password jalan walau templatenya belum diganti (hanya di browser yang memintanya). Setelah sesi terbentuk,
 * row `profiles` dipastikan ada, lalu user diantar ke `next` atau dashboard sesuai role-nya.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const code = searchParams.get('code')

    // URL tujuan dibangun tanpa token, supaya tidak ikut bocor lewat Referer.
    const redirectTo = request.nextUrl.clone()
    redirectTo.search = ''
    // A used or expired link: a reset link goes back to Lupa Password to ask for a new one, anything else to Masuk.
    const recovering = type === 'recovery' || searchParams.get('next') === '/auth/atur-password'
    const failed = () => {
        if (recovering) {
            redirectTo.pathname = '/auth/lupa-password'
            redirectTo.searchParams.set('kedaluwarsa', '1')
        } else {
            redirectTo.pathname = '/auth/login'
            redirectTo.searchParams.set('konfirmasi', 'gagal')
        }
        return NextResponse.redirect(redirectTo)
    }

    const supabase = await createClient()
    let user
    if (tokenHash && type) {
        const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
        if (error) return failed()
        user = data.user
    } else if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) return failed()
        user = data.user
    }
    if (!user) return failed()

    const profile = await ensureProfile(user)
    redirectTo.pathname = safeNext(searchParams.get('next') ?? undefined, HOME_BY_ROLE[profile.role])
    return NextResponse.redirect(redirectTo)
}
