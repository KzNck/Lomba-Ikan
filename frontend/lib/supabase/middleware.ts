import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'
import { SUPABASE_KEY, SUPABASE_URL, hasSupabaseEnv } from './env'

// Butuh sesi. Role-nya sendiri dicek di layout tiap area (butuh query profiles),
// supaya proxy tetap ringan — di sini cuma "sudah login atau belum".
const PROTECTED = ['/nelayan', '/pembeli', '/marketplace']

const startsWithAny = (pathname: string, prefixes: string[]) =>
    prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Env belum diisi: lewati refresh sesi supaya app tetap bisa dibuka.
    if (!hasSupabaseEnv) {
        return supabaseResponse
    }

    const supabase = createServerClient<Database>(
        SUPABASE_URL!,
        SUPABASE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Menyegarkan token sesi jika sudah kedaluwarsa
    // Pastikan tidak meletakkan logic lain antara createServerClient dan getUser()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    if (!user && startsWithAny(pathname, PROTECTED)) {
        const login = request.nextUrl.clone()
        login.pathname = '/auth/login'
        login.search = ''
        // Setelah login, kembali ke halaman yang tadi dituju.
        login.searchParams.set('next', pathname)
        return NextResponse.redirect(login)
    }

    // User yang sudah login dan membuka halaman auth diarahkan oleh halamannya
    // sendiri (lihat homeForCurrentUser) — di sana role-nya sudah diketahui.

    return supabaseResponse
}
