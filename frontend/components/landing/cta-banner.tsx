'use client'

import Link from 'next/link'

interface CtaBannerProps {
  onOpenContact: () => void
}

export function CtaBanner({ onOpenContact }: CtaBannerProps) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2545] via-[#091E3A] to-[#041124] px-6 py-14 sm:px-12 sm:py-20 text-center text-white shadow-2xl">
          {/* Subtle decorative circles */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

          {/* Badge */}
          <div className="relative z-10 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-xs font-semibold text-sky-200 backdrop-blur-xs mb-6">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" aria-hidden="true" />
            <span>Bergabung Bersama Ekosistem Sirkular</span>
          </div>

          {/* Main Title */}
          <h2 className="relative z-10 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight mb-6">
            Siap Memulai Perubahan di Pelabuhan Anda?
          </h2>

          {/* Description */}
          <p className="relative z-10 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Bergabunglah bersama puluhan nelayan dan pelaku industri yang telah mengoptimalkan potensi tangkapan laut, menjaga kelestarian, dan menaikkan nilai tambah ekonomi.
          </p>

          {/* Buttons */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-sky-400 active:scale-98 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2545]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span>Mulai Sekarang Gratis</span>
            </Link>

            <button
              type="button"
              onClick={onOpenContact}
              className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xs hover:bg-white/10 active:scale-98 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2545]"
            >
              <svg className="h-4 w-4 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Hubungi Tim ByCatch Loop</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
