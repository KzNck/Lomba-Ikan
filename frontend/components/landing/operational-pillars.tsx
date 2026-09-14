'use client'

import { useState } from 'react'

export function OperationalPillars() {
  const [activeStep, setActiveStep] = useState<number>(0)

  const pillars = [
    {
      pilar: 'PILAR 1 : RANTAI DINGIN',
      title: 'Preservasi Rantai Dingin Dermaga',
      description:
        'Hub ColdBox terdesentralisasi di Pangkalan Pendaratan Ikan (PPI) menjaga suhu konstan 2°C mengunci kesegaran by-catch selama jendela logistik 24 jam.',
      linkText: 'Standar Higienis PPI/CDP',
      iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          <path d="M2 12h20" />
        </svg>
      ),
    },
    {
      pilar: 'PILAR 2 : STANDARDISASI',
      title: 'Transparansi Grading Kesegaran',
      description:
        'Kategorisasi 3 tingkat: Grade A (Konsumsi Sekunder/Surimi), Grade B (Silase Pakan Ikan Berkualitas), dan Grade C (Biomassa Maggot & Pupuk Bio-organik).',
      linkText: 'Algoritma Penilaian Terbuka',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      pilar: 'PILAR 3 : DISTRIBUSI',
      title: 'Pasar Terbuka B2B Terarah',
      description:
        'Bursa lelang transparan 12 jam memotong perantara tengkulak spekulatif, memastikan kepastian serapan pabrik dan harga minimum yang melindungi nelayan.',
      linkText: 'Kontrak Pengambilan Terjadwal',
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
    },
  ]

  const journeySteps = [
    {
      title: 'Nelayan & Kapal',
      tag: 'Tangkapan Sah',
      action: 'Catat tangkapan sah sebelum merapat.',
      detail: 'Pencatatan estimasi biomassa langsung di atas perahu via aplikasi berbasis lokal tanpa memerlukan koneksi internet aktif.',
      color: 'border-sky-500 bg-sky-50 text-sky-800',
    },
    {
      title: 'Ikan / By-Catch',
      tag: 'A SEGAR',
      action: 'Estimasi kesegaran akurat sesuai Grade A/B/C.',
      detail: 'Computer vision memvalidasi kejernihan mata, tekstur insang, dan kekenyalan ikan dalam hitungan detik di dermaga.',
      color: 'border-emerald-500 bg-emerald-50 text-emerald-800',
    },
    {
      title: 'PPI & Cold Box',
      tag: 'Suhu 2°C Terjaga',
      action: 'Verifikasi berat timbangan dan pendinginan 2°C.',
      detail: 'Penerimaan otomatis dengan timbangan terintegrasi IoT dan penyimpanan rantai dingin terkontrol untuk menjaga higienitas.',
      color: 'border-blue-500 bg-blue-50 text-blue-800',
    },
    {
      title: 'Pembeli Industri',
      tag: 'Hilirisasi Bernilai',
      action: 'Hilirisasi bernilai tinggi untuk pakan & silase.',
      detail: 'Pabrik pengolahan pakan ternak, silase, dan bio-ekstraksi mengambil batch terverifikasi sesuai jadwal penjemputan terjadwal.',
      color: 'border-amber-500 bg-amber-50 text-amber-800',
    },
  ]

  return (
    <section id="pilar" className="py-16 sm:py-24 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-200 px-3.5 py-1.5 text-xs font-semibold text-sky-800 shadow-2xs mb-4">
            <svg className="h-3.5 w-3.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
            </svg>
            <span>Sistem & Arsitektur Nilai</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            Tiga Pilar Operasional Sirkular
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Pendekatan sistemik yang menjamin biomassa laut bernilai guna tinggi dari dermaga hingga pabrik pengolahan sekunder.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pilar, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-md hover:border-sky-300 transition-all"
            >
              <div>
                <div className={`inline-flex p-3 rounded-2xl border mb-5 ${pilar.iconBg}`}>
                  {pilar.icon}
                </div>
                <span className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">
                  {pilar.pilar}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">
                  {pilar.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {pilar.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-700">
                <span>{pilar.linkText}</span>
                <span aria-hidden="true">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Deep-Dive Journey Card */}
        <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-sky-50/20 to-slate-50 p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Narrative list */}
            <div className="lg:col-span-6 flex flex-col text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800 w-fit mb-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Visualisasi Alur Ekosistem</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
                Alur Perjalanan Sirkular ByCatch Loop
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                Mulai dari deteksi dini di geladak perahu tradisional hingga integrasi pabrik pakan dan produsen silase protein. Setiap simpul menjamin integritas mutu dan keadilan harga bagi nelayan.
              </p>

              {/* Interactive Steps Accordion */}
              <div className="space-y-3">
                {journeySteps.map((step, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      activeStep === idx
                        ? 'bg-white border-sky-400 shadow-md ring-1 ring-sky-300'
                        : 'bg-white/70 border-slate-200 hover:border-sky-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {step.title}
                      </h4>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${step.color}`}>
                        {step.tag}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 mt-1">
                      {step.action}
                    </p>
                    {activeStep === idx && (
                      <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100 leading-relaxed animate-in fade-in">
                        {step.detail}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Visual Loop Animation */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-white border border-sky-100 shadow-xs relative">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                {/* SVG circular track */}
                <svg className="absolute inset-0 w-full h-full text-sky-200" viewBox="0 0 200 200" fill="none">
                  <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" />
                  <path d="M175 100a75 75 0 0 1-75 75" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
                  <path d="M25 100a75 75 0 0 1 75-75" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
                </svg>

                {/* Center Node */}
                <div className="z-10 flex flex-col items-center justify-center h-28 w-28 rounded-full bg-white border-2 border-sky-300 shadow-lg p-2 text-center">
                  <div className="h-7 w-7 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mb-1">
                    <svg className="h-4 w-4 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-extrabold text-sky-950 tracking-wider">CIRCULAR</span>
                  <span className="text-[9px] font-bold text-sky-600">LOOP</span>
                </div>

                {/* 4 Orbital Node Pills */}
                <div className="absolute top-2 left-4 rounded-xl bg-white border border-sky-200 p-2 shadow-xs text-left">
                  <span className="text-[10px] font-bold text-slate-900 block">1. Nelayan</span>
                  <span className="text-[9px] text-sky-700">Catat di Laut</span>
                </div>

                <div className="absolute top-2 right-4 rounded-xl bg-white border border-emerald-200 p-2 shadow-xs text-left">
                  <span className="text-[10px] font-bold text-slate-900 block">2. Ikan / By-Catch</span>
                  <span className="text-[9px] text-emerald-700">Grade A/B/C</span>
                </div>

                <div className="absolute bottom-2 left-4 rounded-xl bg-white border border-blue-200 p-2 shadow-xs text-left">
                  <span className="text-[10px] font-bold text-slate-900 block">3. PPI Cold Box</span>
                  <span className="text-[9px] text-blue-700">Suhu 2°C</span>
                </div>

                <div className="absolute bottom-2 right-4 rounded-xl bg-white border border-amber-200 p-2 shadow-xs text-left">
                  <span className="text-[10px] font-bold text-slate-900 block">4. Industri Hilir</span>
                  <span className="text-[9px] text-amber-700">Pakan & Silase</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 text-center max-w-sm mt-4 leading-relaxed">
                Dalam setiap siklus, rantai logistik memprioritaskan pendinginan beremisi rendah dan mengeliminasi kebocoran biomassa terbuang.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
