import Link from 'next/link'
import { CircularDiagram } from './circular-diagram'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 blur-3xl -z-10">
        <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-sky-200" />
        <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full bg-emerald-100" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column - Copy & CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-200/80 px-3.5 py-1.5 text-xs font-semibold text-sky-800 shadow-2xs mb-6">
              <svg className="h-3.5 w-3.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="5" r="3" />
                <line x1="12" y1="22" x2="12" y2="8" />
                <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
              </svg>
              <span>Platform Sirkular Maritim Terintegrasi</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-900 leading-[1.12] mb-6">
              Ubah hasil tangkapan sampingan menjadi peluang.
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 max-w-xl">
              Hubungkan nelayan dengan pembeli industri untuk mengurangi pemborosan hasil tangkapan dan membangun ekonomi laut yang lebih sirkular.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:bg-sky-700 active:scale-98 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 w-full sm:w-auto"
              >
                <span>Mulai Sekarang</span>
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="#cara-kerja"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-300 px-6 py-3.5 text-base font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 active:scale-98 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 w-full sm:w-auto"
              >
                <svg className="h-4 w-4 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
                <span>Pelajari Cara Kerja</span>
              </Link>
            </div>

            {/* Trust points */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 pt-4 border-t border-slate-100 text-xs font-medium text-slate-600">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span>Tervalidasi SNI Penanganan Ikan Segar</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-500" aria-hidden="true" />
                <span>Offline-ready di Zona 12 Mil</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
                <span>Audit Rantai Dingin Terbuka</span>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Circular Diagram */}
          <div className="lg:col-span-5 flex justify-center">
            <CircularDiagram />
          </div>
        </div>
      </div>
    </section>
  )
}
