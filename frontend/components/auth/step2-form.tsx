'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { RoleId, ROLES } from './role-card'

interface Step2FormProps {
  selectedRole: RoleId
  onBackToStep1: () => void
}

export function Step2Form({ selectedRole, onBackToStep1 }: Step2FormProps) {
  const role = ROLES[selectedRole]

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [roleEntity, setRoleEntity] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const getEntityLabel = () => {
    switch (selectedRole) {
      case 'nelayan':
        return 'Nama Kapal & Pelabuhan Pangkalan'
      case 'pembeli':
        return 'Nama Perusahaan / Unit Pengolah Ikan (UPI)'
      case 'ppi':
        return 'Nama Koperasi / UPT Pelabuhan Perikanan'
    }
  }

  const getEntityPlaceholder = () => {
    switch (selectedRole) {
      case 'nelayan':
        return 'Contoh: KM Bahari 08, PPI Muara Angke'
      case 'pembeli':
        return 'Contoh: PT Samudera Pakan Lestari'
      case 'ppi':
        return 'Contoh: KUD Bahari Mandiri / UPT PPI Paotere'
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!fullName.trim()) {
      setErrorMsg('Harap isi Nama Lengkap Anda.')
      return
    }
    if (!phone.trim() || phone.length < 9) {
      setErrorMsg('Harap isi Nomor WhatsApp aktif yang valid.')
      return
    }
    if (!roleEntity.trim()) {
      setErrorMsg(`Harap isi ${getEntityLabel()}.`)
      return
    }
    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter.')
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.')
      return
    }
    if (!agreeTerms) {
      setErrorMsg('Harap centang persetujuan Ketentuan Layanan dan Kebijakan Privasi.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 900)
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-lg text-center animate-in fade-in duration-200">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mb-6 shadow-xs">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-xs font-semibold text-sky-800 mb-3">
          <span>Peran: {role.title}</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Pendaftaran Berhasil!
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-8">
          Akun untuk <span className="font-semibold text-slate-900">{fullName}</span> telah terdaftar dalam sistem ByCatch Loop. Kode verifikasi onboarding telah dikirimkan ke nomor WhatsApp <span className="font-semibold text-slate-900">{phone}</span>.
        </p>

        <div className="space-y-3">
          <Link
            href="/nelayan"
            className="flex items-center justify-center gap-2 w-full rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-sky-700 transition-colors min-h-[44px]"
          >
            Masuk ke Ruang Operasional
          </Link>
          <button
            type="button"
            onClick={onBackToStep1}
            className="flex items-center justify-center w-full rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px]"
          >
            Daftarkan Akun Mitra Lain
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-md text-left">
      {/* Role Confirmation Banner */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-100 mb-7">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 ${role.iconBg}`}>
            <span className="text-xs font-bold uppercase">{selectedRole === 'ppi' ? 'PPI' : selectedRole === 'nelayan' ? 'NEL' : 'IND'}</span>
          </div>
          <div>
            <p className="text-xs text-sky-800 font-medium">Peran Terpilih</p>
            <p className="text-sm font-bold text-slate-900">{role.title}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBackToStep1}
          className="text-xs font-semibold text-sky-700 hover:text-sky-900 hover:underline min-h-[36px] px-2 flex items-center"
        >
          Ubah Peran
        </button>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-150"
        >
          <svg className="h-5 w-5 shrink-0 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="leading-tight pt-0.5">{errorMsg}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Nama Lengkap <span className="text-rose-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Contoh: Bambang Sudarsono"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all min-h-[44px]"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="081234567890"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all min-h-[44px]"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Digunakan untuk konfirmasi lelang dan notifikasi pencatatan pelabuhan.
          </p>
        </div>

        <div>
          <label htmlFor="roleEntity" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            {getEntityLabel()} <span className="text-rose-500">*</span>
          </label>
          <input
            id="roleEntity"
            type="text"
            required
            value={roleEntity}
            onChange={(e) => setRoleEntity(e.target.value)}
            placeholder={getEntityPlaceholder()}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all min-h-[44px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pass" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Kata Sandi <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="pass"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all min-h-[44px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPass" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Konfirmasi Sandi <span className="text-rose-500">*</span>
            </label>
            <input
              id="confirmPass"
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all min-h-[44px]"
            />
          </div>
        </div>

        {/* Terms agreement checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="h-4 w-4 mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 shrink-0"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              Saya menyetujui Ketentuan Layanan dan Kebijakan Privasi ByCatch Loop untuk keterlacakan mutu ikan dan tata kelola pelabuhan.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-3.5 text-sm sm:text-base font-semibold text-white shadow-xs hover:bg-sky-700 active:scale-[0.99] disabled:opacity-70 transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Mendaftarkan Akun...</span>
              </>
            ) : (
              <span>Daftar Akun {role.title}</span>
            )}
          </button>

          <button
            type="button"
            onClick={onBackToStep1}
            className="w-full flex items-center justify-center gap-1.5 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px]"
          >
            <span aria-hidden="true">←</span>
            <span>Kembali ke Pemilihan Peran</span>
          </button>
        </div>
      </form>
    </div>
  )
}
