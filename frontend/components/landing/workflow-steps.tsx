export function WorkflowSteps() {
  const steps = [
    {
      step: '01',
      title: 'Tangkap',
      description: 'Nelayan mencatat by-catch langsung di laut atau saat sandar dalam ≤5 tap mudah dan intuitif.',
      badgeText: 'Bekerja tanpa sinyal 4G',
      badgeIcon: (
        <svg className="h-3.5 w-3.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M2 20h.01M7 20v-4M12 20v-8M17 20V4" />
        </svg>
      ),
      icon: (
        <svg className="h-6 w-6 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.03" />
          <path d="M12 10V4" />
          <path d="M12 4l5 3-5 3" />
        </svg>
      ),
    },
    {
      step: '02',
      title: 'Cek',
      description: 'Sistem memberikan estimasi freshness secara objektif (Grade A/B/C) tanpa jargon rumit.',
      badgeText: 'Standardisasi Grade Instan',
      badgeIcon: (
        <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
      ),
      icon: (
        <svg className="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          <path d="M2 12h20" />
          <path d="m20 16-4-4 4-4" />
          <path d="m4 8 4 4-4 4" />
          <path d="m16 4-4 4-4-4" />
          <path d="m8 20 4-4 4 4" />
        </svg>
      ),
    },
    {
      step: '03',
      title: 'Temukan',
      description: 'Pembeli melihat batch yang tersedia secara real-time dengan batas waktu countdown terukur.',
      badgeText: 'Lelang Transparan 12 Jam',
      badgeIcon: (
        <svg className="h-3.5 w-3.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      icon: (
        <svg className="h-6 w-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
        </svg>
      ),
    },
    {
      step: '04',
      title: 'Manfaatkan',
      description: 'Batch diambil di PPI/Cold Box untuk kebutuhan hilirisasi pakan, silase, atau pupuk organik.',
      badgeText: 'Serah Terima QR di PPI',
      badgeIcon: (
        <svg className="h-3.5 w-3.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <rect width="5" height="5" x="3" y="3" rx="1" />
          <rect width="5" height="5" x="16" y="3" rx="1" />
          <rect width="5" height="5" x="3" y="16" rx="1" />
          <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
          <path d="M21 21v.01" />
          <path d="M12 7v3a2 2 0 0 1-2 2H7" />
          <path d="M3 12h.01" />
          <path d="M12 3h.01" />
          <path d="M12 16v.01" />
          <path d="M16 12h1" />
          <path d="M21 12v.01" />
          <path d="M12 21v-1" />
        </svg>
      ),
      icon: (
        <svg className="h-6 w-6 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
      ),
    },
  ]

  return (
    <section id="cara-kerja" className="py-16 sm:py-24 bg-slate-50/70 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-200 px-3.5 py-1.5 text-xs font-semibold text-sky-800 shadow-2xs mb-4">
          <svg className="h-3.5 w-3.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M2 20h20" />
            <path d="M5 20V8l7-5 7 5v12" />
          </svg>
          <span>Langkah Sederhana</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
          Bagaimana ByCatch Loop Bekerja
        </h2>

        {/* Section Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-14 leading-relaxed">
          Proses cepat dari geladak kapal hingga hilirisasi industri bernilai tambah tanpa friksi birokrasi.
        </p>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {steps.map((item) => (
            <div
              key={item.step}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md hover:border-sky-200 transition-all group"
            >
              <div>
                {/* Top Row: Icon + Step Number */}
                <div className="flex items-center justify-between mb-5">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-sky-50 group-hover:border-sky-100 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-xl font-extrabold text-sky-400">
                    {item.step}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>

                {/* Step Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Bottom Feature Badge */}
              <div className="pt-4 border-t border-slate-100">
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                  {item.badgeIcon}
                  <span>{item.badgeText}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
