'use client'

import Link from 'next/link'

interface CtaBannerProps {
  onOpenContact: () => void
  onOpenReport: () => void
}

export function CtaBanner({ onOpenContact, onOpenReport }: CtaBannerProps) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2545] via-[#091E3A] to-[#041124] px-6 py-14 sm:px-12 sm:py-20 text-center text-white shadow-2xl">
          {/* Subtle decorative glow circles */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

          {/* Badge */}
          <div className="relative z-10 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-xs font-semibold text-sky-200 backdrop-blur-xs mb-6">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" aria-hidden="true" />
            <span>Gerakan Ekonomi Biru Terbuka</span>
          </div>

          {/* Main Title */}
          <h2 className="relative z-10 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight mb-6">
            Bergabung dalam Gerakan Ekonomi Biru Berkelanjutan
          </h2>

          {/* Description */}
          <p className="relative z-10 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Apakah Anda industri pengolah pakan, koperasi nelayan dermaga, atau lembaga filantropi lingkungan? Mari bersama ciptakan masa depan rantai pasok kelautan yang adil, efisien, dan ramah biosfer.
          </p>

          {/* Buttons */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-sky-400 active:scale-98 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2545]"
            >
              <span>Mulai Kemitraan Sirkular</span>
              <span aria-hidden="true">→</span>
            </Link>

            <button
              type="button"
              onClick={onOpenReport}
              className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xs hover:bg-white/10 active:scale-98 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2545]"
            >
              <svg className="h-4 w-4 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Unduh Laporan Dampak & Metrik</span>
            </button>

            <button
              type="button"
              onClick={onOpenContact}
              className="inline-flex items-center justify-center gap-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              <span>Atau Konsultasi Integrasi Pelabuhan</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
