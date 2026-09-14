'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { RegisterHeader } from '@/components/auth/register-header'
import { RegisterFooter } from '@/components/auth/register-footer'
import { RoleCard, RoleId, ROLES } from '@/components/auth/role-card'
import { Step2Form } from '@/components/auth/step2-form'
import { FacilitatorModal } from '@/components/auth/facilitator-modal'

function RegisterContent() {
  const searchParams = useSearchParams()
  const initialRoleParam = searchParams.get('role') as RoleId | null

  const [selectedRole, setSelectedRole] = useState<RoleId>(() => {
    if (initialRoleParam && (initialRoleParam === 'nelayan' || initialRoleParam === 'pembeli' || initialRoleParam === 'ppi')) {
      return initialRoleParam
    }
    return 'nelayan'
  })
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [facilitatorModalOpen, setFacilitatorModalOpen] = useState(false)

  const currentRoleConfig = ROLES[selectedRole]

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Header Navigation */}
      <RegisterHeader onOpenHelp={() => setFacilitatorModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col items-center">
        {/* Step Progress Badge */}
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200/60 mb-5">
          <span className="h-2 w-2 rounded-full bg-sky-600" aria-hidden="true" />
          <span>
            {currentStep === 1
              ? 'LANGKAH 1 DARI 2 · PERSONALISASI AKUN'
              : 'LANGKAH 2 DARI 2 · DATA AKUN & VERIFIKASI'}
          </span>
        </div>

        {/* Dynamic Title and Description */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-slate-900 tracking-tight leading-tight">
            {currentStep === 1
              ? 'Anda menggunakan ByCatch Loop sebagai siapa?'
              : 'Lengkapi Data Pendaftaran Akun'}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            {currentStep === 1
              ? 'Pilih peran utama Anda untuk menyesuaikan antarmuka, fitur pencatatan, dan akses pasar sesuai kebutuhan operasional di lapangan.'
              : `Registrasi akun terpadu untuk peran ${currentRoleConfig.title} guna akses fitur verifikasi dan tata kelola tangkapan.`}
          </p>
        </div>

        {/* Step 1: Role Selection Grid */}
        {currentStep === 1 ? (
          <div className="w-full flex flex-col items-center">
            {/* 3 Role Selection Cards */}
            <div
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-6xl"
              role="radiogroup"
              aria-label="Pilihan peran akun ByCatch Loop"
            >
              {(['nelayan', 'pembeli', 'ppi'] as RoleId[]).map((roleKey) => (
                <RoleCard
                  key={roleKey}
                  role={ROLES[roleKey]}
                  isSelected={selectedRole === roleKey}
                  onSelect={(id) => setSelectedRole(id)}
                />
              ))}
            </div>

            {/* Info Notice Pill */}
            <div className="mt-8 max-w-2xl w-full rounded-full bg-sky-50/70 border border-sky-200/70 px-5 py-3 text-xs sm:text-sm text-slate-700 flex items-center justify-center gap-2 text-center shadow-2xs">
              <svg
                className="h-4 w-4 text-sky-600 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>
                Dapat berganti peran kapan saja melalui menu{' '}
                <span className="font-semibold text-slate-900">Pengaturan Profil</span>{' '}
                setelah pendaftaran.
              </span>
            </div>

            {/* Main Action CTA Button */}
            <div className="mt-6 w-full max-w-md">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-xs hover:bg-sky-700 active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 min-h-[44px] cursor-pointer"
              >
                <span>{currentRoleConfig.ctaText}</span>
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Secondary Links: Already have account / Need facilitator assistance */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-slate-600">
              <span>
                Sudah punya akun?{' '}
                <Link
                  href="/auth/login"
                  className="font-medium text-sky-600 hover:text-sky-700 hover:underline min-h-[36px] inline-flex items-center"
                >
                  Masuk
                </Link>
              </span>
              <span className="text-slate-300 select-none">•</span>
              <span>
                Butuh panduan?{' '}
                <button
                  type="button"
                  onClick={() => setFacilitatorModalOpen(true)}
                  className="font-medium text-sky-600 hover:text-sky-700 hover:underline min-h-[36px] inline-flex items-center cursor-pointer"
                >
                  Hubungi Fasilitator
                </button>
              </span>
            </div>
          </div>
        ) : (
          /* Step 2: Account Registration Form */
          <div className="w-full">
            <Step2Form
              selectedRole={selectedRole}
              onBackToStep1={() => setCurrentStep(1)}
            />
          </div>
        )}

        {/* Verification & Certification Badges Row */}
        <div className="w-full max-w-4xl mt-14 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-slate-500 text-center">
          {/* Item 1: SNI & KKP Certification */}
          <div className="inline-flex items-center gap-2">
            <svg
              className="h-4 w-4 text-emerald-600 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <span>Tervalidasi sesuai SNI Penanganan Ikan Segar & Prinsip Keterlacakan KKP</span>
          </div>

          <span className="text-slate-300 hidden sm:inline select-none">|</span>

          {/* Item 2: SDG 14 Alignment */}
          <div className="inline-flex items-center gap-2">
            <svg
              className="h-4 w-4 text-sky-600 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>SDG 14 Konservasi Laut Berkelanjutan</span>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <RegisterFooter onOpenHelp={() => setFacilitatorModalOpen(true)} />

      {/* Facilitator Contact Modal Dialog */}
      <FacilitatorModal
        isOpen={facilitatorModalOpen}
        onClose={() => setFacilitatorModalOpen(false)}
      />
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
          <div className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 border border-slate-200 shadow-xs text-sm font-medium text-slate-700">
            <svg className="h-5 w-5 animate-spin text-sky-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Memuat data pendaftaran...</span>
          </div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  )
}
