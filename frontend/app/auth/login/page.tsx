'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { RegisterHeader } from '@/components/auth/register-header'
import { RegisterFooter } from '@/components/auth/register-footer'
import { FacilitatorModal } from '@/components/auth/facilitator-modal'

export default function LoginPage() {
  const [phoneOrEmail, setPhoneOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [facilitatorModalOpen, setFacilitatorModalOpen] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!phoneOrEmail.trim()) {
      setErrorMsg('Harap masukkan nomor WhatsApp atau surel terdaftar.')
      return
    }
    if (!password) {
      setErrorMsg('Harap masukkan kata sandi akun Anda.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-sky-500 selection:text-white">
      <RegisterHeader onOpenHelp={() => setFacilitatorModalOpen(true)} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col items-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-md text-left">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 mb-6 shadow-2xs">
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

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Masuk ke ByCatch Loop
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
            Akses portal pencatatan nelayan, lelang industri, dan data rantai dingin PPI.
          </p>

          {success ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-emerald-900">Login Berhasil</h2>
              <p className="text-xs text-emerald-700">
                Selamat datang kembali di ByCatch Loop. Menghubungkan Anda ke sesi operasional pelabuhan...
              </p>
              <Link
                href="/nelayan"
                className="inline-flex items-center justify-center w-full rounded-full bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800"
              >
                Lanjutkan ke Dashboard
              </Link>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              {errorMsg && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2"
                >
                  <svg className="h-4 w-4 shrink-0 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label htmlFor="loginIdentifier" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Nomor WhatsApp / Surel
                </label>
                <input
                  id="loginIdentifier"
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="081234567890 atau email@domain.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all min-h-[44px]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="loginPass" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => setFacilitatorModalOpen(true)}
                    className="text-xs text-sky-600 hover:text-sky-800 hover:underline"
                  >
                    Lupa sandi?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="loginPass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-700 active:scale-[0.99] disabled:opacity-70 transition-all min-h-[44px] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Memverifikasi...</span>
                    </>
                  ) : (
                    <span>Masuk ke Akun</span>
                  )}
                </button>
              </div>

              <div className="pt-4 text-center text-xs text-slate-500 border-t border-slate-100">
                Belum memiliki akun?{' '}
                <Link
                  href="/auth/register"
                  className="font-semibold text-sky-600 hover:text-sky-800 hover:underline min-h-[36px] inline-flex items-center"
                >
                  Daftar Sekarang
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <RegisterFooter onOpenHelp={() => setFacilitatorModalOpen(true)} />
      <FacilitatorModal
        isOpen={facilitatorModalOpen}
        onClose={() => setFacilitatorModalOpen(false)}
      />
    </div>
  )
}
