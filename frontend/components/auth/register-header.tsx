'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface RegisterHeaderProps {
  onOpenHelp?: () => void
}

export function RegisterHeader({ onOpenHelp }: RegisterHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/#tentang', label: 'Tentang' },
    { href: '/#cara-kerja', label: 'Cara Kerja' },
    { href: '/#dampak-sdg', label: 'Dampak SDGs' },
  ]

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? 'border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-2xs'
          : 'border-b border-slate-200/60 bg-white'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with MARITIME CIRCULAR subtext */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 rounded-lg py-1 px-1.5 shrink-0"
          aria-label="ByCatch Loop Beranda"
        >
          {/* Logo mark */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100 shadow-2xs group-hover:scale-105 transition-transform">
            <svg
              className="h-6 w-6"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M14 4C8.477 4 4 8.477 4 14C4 16.761 5.119 19.261 6.929 21.071L9.05 18.95C7.79 17.69 7 15.94 7 14C7 10.134 10.134 7 14 7C16.895 7 19.381 8.752 20.45 11.23L23.21 10.03C21.68 6.51 18.13 4 14 4Z"
                fill="#0284C7"
              />
              <path
                d="M14 24C19.523 24 24 19.523 24 14C24 11.239 22.881 8.739 21.071 6.929L18.95 9.05C20.21 10.31 21 12.06 21 14C21 17.866 17.866 21 14 21C11.105 21 8.619 19.248 7.55 16.77L4.79 17.97C6.32 21.49 9.87 24 14 24Z"
                fill="#0EA5E9"
              />
              <circle cx="14" cy="14" r="2.5" fill="#0369A1" />
            </svg>
          </div>

          {/* Typography */}
          <div className="flex flex-col text-left">
            <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
              ByCatchLoop
            </span>
            <span className="text-[9px] font-semibold text-slate-400 tracking-widest uppercase mt-0.5">
              MARITIME CIRCULAR
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Navigasi Header Register">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-sky-700 transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded-md px-1"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#bantuan"
            onClick={(e) => {
              if (onOpenHelp) {
                e.preventDefault()
                onOpenHelp()
              }
            }}
            className="text-sm font-medium text-slate-600 hover:text-sky-700 transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded-md px-1 cursor-pointer"
          >
            Bantuan
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-slate-700 hover:text-sky-700 px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded-lg"
          >
            Masuk
          </Link>

          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-700 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
          >
            Mulai Sekarang
          </Link>

          {/* User Profile Circular Avatar Button */}
          <Link
            href="/auth/login"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-700 text-white hover:bg-sky-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 shrink-0 shadow-2xs"
            aria-label="Profil Akun Pengguna"
            title="Masuk ke Akun"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-slate-700 hover:text-sky-700 px-2 py-1.5"
          >
            Masuk
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 min-h-[44px] min-w-[44px]"
            aria-expanded={mobileMenuOpen}
            aria-label="Buka menu navigasi"
          >
            <span className="sr-only">Buka menu</span>
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="#bantuan"
              onClick={(e) => {
                setMobileMenuOpen(false)
                if (onOpenHelp) {
                  e.preventDefault()
                  onOpenHelp()
                }
              }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors min-h-[44px] flex items-center cursor-pointer"
            >
              Bantuan
            </a>

            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-full bg-sky-600 py-3 text-center text-sm font-semibold text-white shadow-xs hover:bg-sky-700 min-h-[44px]"
              >
                Mulai Sekarang
              </Link>
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-full border border-slate-300 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 min-h-[44px]"
              >
                Masuk ke Akun
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
