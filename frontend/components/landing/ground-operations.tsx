import Image from 'next/image'

export function GroundOperations() {
  return (
    <section id="kemitraan" className="py-16 sm:py-24 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-200 px-3.5 py-1.5 text-xs font-semibold text-sky-800 shadow-2xs mb-4">
            <svg className="h-3.5 w-3.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Aktivitas di Dermaga</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            Kemitraan Nyata di Garis Pantai Nusantara
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
            Setiap hari, fasilitator pelabuhan ByCatch Loop menyambut kedatangan perahu nelayan, melakukan scanning mutu cepat, dan memindahkan tangkapan samping ke insulasi Cold Box terpusat sebelum lelang otomatis dibuka.
          </p>

          {/* Location & Partner Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-800">
              <svg className="h-3.5 w-3.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Hub Pendaratan: Pelabuhan Muncar, Banyuwangi</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-800">
              <svg className="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Efektivitas bersama Koperasi Nelayan Samudera Sejahtera</span>
            </div>
          </div>
        </div>

        {/* 2 Photographic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Dock Activity */}
          <div className="flex flex-col rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-md transition-shadow">
            <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
              <Image
                src="/images/muncar-dock.jpg"
                alt="Pendaratan tangkapan nelayan di dermaga Muncar Banyuwangi"
                fill
                className="object-cover hover:scale-103 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                <span>Pelabuhan Muncar</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Pendaratan Tangkapan Nelayan di Dermaga Tradisional
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pemilahan awal di bibir dermaga memungkinkan ikan rucah langsung diselamatkan sebelum terpapar degradasi panas geladak terbuka.
              </p>
            </div>
          </div>

          {/* Card 2: Cold Box Inspection */}
          <div className="flex flex-col rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-md transition-shadow">
            <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
              <Image
                src="/images/coldbox-inspection.jpg"
                alt="Penyerahan dan pendinginan di Cold Box PPI berstandarisasi"
                fill
                className="object-cover hover:scale-103 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Rantai Dingin Terpadu</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Penyerahan & Pendinginan di Cold Box PPI Berstandar
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Timbangan digital terkalibrasi dan suhu 2°C terkontrol memastikan kepastian volume serta transparansi nota timbang bagi nelayan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
