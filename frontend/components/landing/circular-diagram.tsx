'use client'

import { useState } from 'react'

export function CircularDiagram() {
  const [activeNode, setActiveNode] = useState<number | null>(null)

  const nodes = [
    {
      id: 1,
      title: 'Nelayan & Kapal',
      subtitle: 'Catat By-Catch di Laut',
      tag: 'Tangkapan Sah',
      tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      icon: (
        <svg className="h-5 w-5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.03" />
          <path d="M12 10V4" />
          <path d="M12 4l5 3-5 3" />
        </svg>
      ),
      description: 'Pencatatan langsung di laut melalui aplikasi offline-ready dengan 5 tap mudah.',
    },
    {
      id: 2,
      title: 'Ikan / By-Catch',
      subtitle: 'Estimasi Kesegaran',
      tag: 'A SEGAR',
      tagColor: 'text-emerald-800 bg-emerald-100 border-emerald-300 font-bold',
      icon: (
        <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6-3.56 0-7.56-2.54-8.5-6Z" />
          <path d="M18 12v.5" />
          <path d="M16 17.93a12.6 12.6 0 0 1-5.07-4.32" />
          <path d="M2 12h4.5" />
        </svg>
      ),
      description: 'Penilaian mutu kesegaran ikan cepat berbasis computer vision dengan grade objektif.',
    },
    {
      id: 3,
      title: 'PPI & Cold Box',
      subtitle: 'Verifikasi & Simpan Es',
      tag: 'Suhu 2°C Terjaga',
      tagColor: 'text-sky-700 bg-sky-50 border-sky-200',
      icon: (
        <svg className="h-5 w-5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
      description: 'Penyimpanan terstandarisasi di pelabuhan dengan audit rantai dingin real-time.',
    },
    {
      id: 4,
      title: 'Pembeli Industri',
      subtitle: 'Pakan, Silase, Pupuk',
      tag: 'Terkoneksi Otomatis',
      tagColor: 'text-amber-800 bg-amber-50 border-amber-200',
      icon: (
        <svg className="h-5 w-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M18 16h2" />
        </svg>
      ),
      description: 'Kemitraan hilirisasi biomassa laut bernilai tambah tinggi untuk industri pengolahan.',
    },
  ]

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Top floating pill badge */}
      <div className="flex justify-end mb-3 pr-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span>Grade A Estimasi Cepat</span>
        </div>
      </div>

      {/* Main Diagram Card Container */}
      <div className="relative rounded-3xl border border-sky-100/90 bg-gradient-to-br from-white via-sky-50/30 to-blue-50/40 p-6 sm:p-8 shadow-xl backdrop-blur-xs">
        {/* Background circular track SVG */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <svg className="w-64 h-64 sm:w-72 sm:h-72 opacity-20" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="70" stroke="#0284C7" strokeWidth="2" strokeDasharray="6 6" />
          </svg>
        </div>

        {/* 2x2 Grid of Nodes */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Node 1: Nelayan & Kapal (Top Left) */}
          <button
            type="button"
            onClick={() => setActiveNode(activeNode === 1 ? null : 1)}
            onMouseEnter={() => setActiveNode(1)}
            onMouseLeave={() => setActiveNode(null)}
            className={`text-left rounded-2xl p-4 transition-all duration-200 border ${
              activeNode === 1
                ? 'bg-white border-sky-400 shadow-md scale-[1.02]'
                : 'bg-white/90 border-slate-200/80 hover:border-sky-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-50 border border-sky-100">
                  {nodes[0].icon}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">{nodes[0].title}</h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-2.5">{nodes[0].subtitle}</p>
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium border ${nodes[0].tagColor}`}>
              <svg className="h-3 w-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {nodes[0].tag}
            </span>
          </button>

          {/* Node 2: Ikan / By-Catch (Top Right) */}
          <button
            type="button"
            onClick={() => setActiveNode(activeNode === 2 ? null : 2)}
            onMouseEnter={() => setActiveNode(2)}
            onMouseLeave={() => setActiveNode(null)}
            className={`text-left rounded-2xl p-4 transition-all duration-200 border ${
              activeNode === 2
                ? 'bg-white border-emerald-400 shadow-md scale-[1.02]'
                : 'bg-white/90 border-slate-200/80 hover:border-emerald-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                  {nodes[1].icon}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">{nodes[1].title}</h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-2.5">{nodes[1].subtitle}</p>
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] border ${nodes[1].tagColor}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              {nodes[1].tag}
            </span>
          </button>

          {/* Center Circular Loop Element */}
          <div className="col-span-1 sm:col-span-2 flex items-center justify-center my-[-8px] sm:my-[-12px] z-20 pointer-events-none">
            <div className="flex items-center gap-2 rounded-full bg-white/95 border border-sky-200 px-4 py-1.5 shadow-md">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                <svg className="h-4 w-4 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-sky-900 tracking-wider">CIRCULAR LOOP</span>
            </div>
          </div>

          {/* Node 3: PPI & Cold Box (Bottom Left) */}
          <button
            type="button"
            onClick={() => setActiveNode(activeNode === 3 ? null : 3)}
            onMouseEnter={() => setActiveNode(3)}
            onMouseLeave={() => setActiveNode(null)}
            className={`text-left rounded-2xl p-4 transition-all duration-200 border ${
              activeNode === 3
                ? 'bg-white border-sky-400 shadow-md scale-[1.02]'
                : 'bg-white/90 border-slate-200/80 hover:border-sky-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-50 border border-sky-100">
                  {nodes[2].icon}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">{nodes[2].title}</h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-2.5">{nodes[2].subtitle}</p>
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium border ${nodes[2].tagColor}`}>
              {nodes[2].tag}
            </span>
          </button>

          {/* Node 4: Pembeli Industri (Bottom Right) */}
          <button
            type="button"
            onClick={() => setActiveNode(activeNode === 4 ? null : 4)}
            onMouseEnter={() => setActiveNode(4)}
            onMouseLeave={() => setActiveNode(null)}
            className={`text-left rounded-2xl p-4 transition-all duration-200 border ${
              activeNode === 4
                ? 'bg-white border-amber-400 shadow-md scale-[1.02]'
                : 'bg-white/90 border-slate-200/80 hover:border-amber-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-100">
                  {nodes[3].icon}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">{nodes[3].title}</h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-2.5">{nodes[3].subtitle}</p>
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium border ${nodes[3].tagColor}`}>
              {nodes[3].tag}
            </span>
          </button>
        </div>

        {/* Active Node Interactive Tooltip */}
        {activeNode && (
          <div className="mt-4 rounded-xl bg-sky-900 text-white p-3 text-xs shadow-lg animate-in fade-in duration-150">
            <span className="font-semibold text-sky-200">{nodes[activeNode - 1].title}: </span>
            {nodes[activeNode - 1].description}
          </div>
        )}
      </div>

      {/* Floating Bottom Right Badge */}
      <div className="flex justify-end mt-3 pr-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-sky-200 px-3.5 py-1.5 text-xs font-semibold text-sky-800 shadow-sm">
          <svg className="h-3.5 w-3.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span>Suhu 2°C Terjaga</span>
        </div>
      </div>
    </div>
  )
}
