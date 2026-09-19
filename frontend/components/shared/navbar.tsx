'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useOnlineStatus } from '@/hooks/use-online-status'

export function Navbar() {
    const pathname = usePathname()
    const isOnline = useOnlineStatus()

    if (pathname === '/' || pathname.startsWith('/auth') || pathname.startsWith('/nelayan') || pathname.startsWith('/pembeli') || pathname.startsWith('/marketplace')) {
        return null
    }

    const navLinks = [
        { href: '/', label: 'Beranda' },
        { href: '/marketplace', label: 'Marketplace' },
        { href: '/nelayan', label: 'Dashboard Nelayan' },
        { href: '/nelayan/catat', label: 'Catat Tangkapan' },
        { href: '/transaksi', label: 'Transaksi' },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-600 dark:text-blue-400">
                        <span className="text-2xl">🐟</span>
                        <span>NelayanGo</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                                            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    {/* Status Offline / Online Indikator */}
                    <div
                        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${
                            isOnline
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                                : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                        }`}
                    >
                        <span
                            className={`h-2 w-2 rounded-full ${
                                isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                            }`}
                        />
                        <span>{isOnline ? 'Online' : 'Offline (Tersimpan Lokal)'}</span>
                    </div>

                    <Link
                        href="/auth/login"
                        className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                    >
                        Masuk
                    </Link>
                </div>
            </div>
        </header>
    )
}
