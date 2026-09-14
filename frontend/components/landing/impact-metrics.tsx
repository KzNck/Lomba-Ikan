export function ImpactMetrics() {
  const metrics = [
    {
      id: 'biomass',
      value: '1.284 kg',
      title: 'Biomassa terselamatkan',
      description: 'Dari potensi terbuang percuma di laut',
      iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
      valueColor: 'text-sky-600',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6-3.56 0-7.56-2.54-8.5-6Z" />
          <path d="M18 12v.5" />
          <path d="M16 17.93a12.6 12.6 0 0 1-5.07-4.32" />
          <path d="M2 12h4.5" />
        </svg>
      ),
    },
    {
      id: 'batches',
      value: '86',
      title: 'Batch tersalurkan',
      description: 'Ke industri pakan bernutrisi & silase',
      iconBg: 'bg-amber-50 text-amber-700 border-amber-100',
      valueColor: 'text-slate-900',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m7.5 4.27 9 5.15" />
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      ),
    },
    {
      id: 'fishermen',
      value: '24',
      title: 'Nelayan aktif',
      description: 'Di 3 pelabuhan percontohan maritim',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      valueColor: 'text-slate-900',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="5" r="3" />
          <line x1="12" y1="22" x2="12" y2="8" />
          <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
        </svg>
      ),
    },
  ]

  return (
    <section id="dampak" className="py-12 sm:py-16 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 md:p-10 shadow-sm">
          {/* Top Tag Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <svg className="h-4 w-4 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m22 7-8.5 8.5-5-5L2 17" />
                <path d="M16 7h6v6" />
              </svg>
              <span>Dampak Akumulatif Periode Berjalan</span>
            </div>

            <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              <span>Sinkronisasi Data PPI Nasional</span>
            </div>
          </div>

          {/* 3 Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50/60 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className={`p-3 rounded-xl border shrink-0 ${metric.iconBg}`}>
                  {metric.icon}
                </div>
                <div className="flex flex-col text-left">
                  <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${metric.valueColor} mb-1`}>
                    {metric.value}
                  </span>
                  <span className="text-base font-bold text-slate-900 leading-snug">
                    {metric.title}
                  </span>
                  <span className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {metric.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
