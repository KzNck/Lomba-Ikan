'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function LandingHeader() {
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
    { href: '#tentang', label: 'Tentang' },
    { href: '#cara-kerja', label: 'Cara Kerja' },
    { href: '#dampak', label: 'Dampak' },
    { href: '#bantuan', label: 'Bantuan' },
  ]

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? 'border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs'
          : 'border-b border-transparent bg-white/80 backdrop-blur-xs'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 rounded-lg py-1 px-1.5"
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

          {/* Logo typography */}
          <div className="flex flex-col text-left">
            <span className="font-bold text-lg tracking-tight text-slate-900 leading-tight">
              ByCatch Loop
            </span>
            <span className="text-[11px] font-medium text-slate-500 tracking-wide">
              Sirkular Bahari Nusantara
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navigasi Utama">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-sky-700 transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded-md px-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-slate-700 hover:text-sky-700 px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded-lg"
          >
            Masuk
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-700 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Daftar</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-slate-700 hover:text-sky-700 px-2.5 py-1.5"
          >
            Masuk
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
            aria-expanded={mobileMenuOpen}
            aria-label="Buka menu navigasi"
          >
            <span className="sr-only">Buka menu</span>
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.75"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.75"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <Link
                href="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 text-center text-sm font-semibold text-white shadow-xs hover:bg-sky-700"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Daftar Akun Baru</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
