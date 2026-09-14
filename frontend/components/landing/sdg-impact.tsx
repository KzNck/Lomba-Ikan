export function SdgImpact() {
  const ecologicalMetrics = [
    {
      value: '1.284 kg',
      tag: '+18% MoM',
      tagColor: 'bg-sky-50 text-sky-700 border-sky-200',
      title: 'Biomassa Terselamatkan',
      desc: 'Dari potensi busuk di dek dan pembuangan liar di laut lepas.',
      icon: (
        <svg className="h-5 w-5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6-3.56 0-7.56-2.54-8.5-6Z" />
          <path d="M2 12h4.5" />
        </svg>
      ),
    },
    {
      value: '3,4 Ton',
      tag: 'Tervalidasi',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: 'Emisi CO2e Tereduksi',
      desc: 'Melalui pencegahan dekomposisi biomassa laut secara aerob/anaerob.',
      icon: (
        <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        </svg>
      ),
    },
    {
      value: '+32%',
      tag: 'Jaring Sosial Nelayan',
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
      title: 'Tambahan Penghasilan',
      desc: 'Rata-rata pemasukan tambahan mingguan bagi mitra nelayan.',
      icon: (
        <svg className="h-5 w-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      value: '100%',
      tag: 'Audit KKP',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
      title: 'Keterlacakan Sumber',
      desc: 'Tersedia nomor batch & QR trace-link di setiap kontainer.',
      icon: (
        <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
  ]

  const sdgItems = [
    {
      number: '14',
      title: 'Life Below Water (Ekosistem Lautan)',
      badge: 'Prioritas Utama',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      borderAccent: 'border-t-4 border-t-[#0A97D9]',
      description:
        'Mengurangi praktik overfishing tidak terencana, meminimalkan discard biomass ikan yang dibuang kembali ke perairan lepas, serta menjaga kestabilan rantai trofik keanekaragaman hayati perairan pesisir Nusantara.',
      targets: [
        {
          code: 'Target 14.1: Pengendalian Polusi',
          detail: 'Menghentikan bangkai limbah ikan membusuk di pelabuhan dan zona pesisir pantai.',
        },
        {
          code: 'Target 14.b: Perikanan Berkelanjutan',
          detail: 'Penyediaan akses teknologi terapan bagi nelayan tradisional, serta muara tangkap PPI.',
        },
      ],
      footerNote: 'Metrik Utama: Tonase By-Catch Tercegah & Diutilisasi',
      compliance: 'Kepatuhan: RZWP3K & PPI',
      colSpan: 'lg:col-span-6',
    },
    {
      number: '12',
      title: 'Responsible Consumption & Production',
      badge: 'Pencegahan Food Loss',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      borderAccent: 'border-t-4 border-t-[#CF8D2A]',
      description:
        'Mencegah food loss & waste pada rantai pasok maritim melalui pengalihan tangkapan non-komersial menjadi bahan baku industri bernilai tambah tinggi.',
      targets: [
        {
          code: 'Target 12.3: Reduksi Susut Pangan',
          detail: '50% efisiensi rantai distribusi by-catch ke industri pakan maggot & silase cair.',
        },
      ],
      footerNote: 'Pemanfaatan Biomassa: 96% Terserap Industri',
      compliance: 'Zero Organic Waste',
      colSpan: 'lg:col-span-6',
    },
    {
      number: '2',
      title: 'Zero Hunger (Ketahanan Pangan)',
      badge: 'Substitusi Pakan Lokal',
      badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-200',
      borderAccent: 'border-t-4 border-t-[#DDA63A]',
      description:
        'Mengalihkan protein ikan bernutrisi menjadi bio-silase bermutu bagi peternak rakyat dan pakan budidaya air tawar terjangkau di kawasan sentra pangan.',
      targets: [
        {
          code: 'Target 2.4: Pangan Berkelanjutan',
          detail: 'Substitusi tepung pelet komersial mahal dengan biomassa laut ekstra lokal.',
        },
      ],
      footerNote: 'Efisiensi Biaya Pakan: Turun hingga 23%',
      compliance: 'Sentra Pangan',
      colSpan: 'lg:col-span-4',
    },
    {
      number: '8',
      title: 'Pekerjaan Layak & Pertumbuhan',
      badge: 'Inklusi Ekonomi Nelayan',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
      borderAccent: 'border-t-4 border-t-[#A21942]',
      description:
        'Memberdayakan nelayan skala kecil dan pengelola koperasi pesisir dengan monetisasi tangkapan sampingan yang sebelumnya bernilai nol rupiah.',
      targets: [
        {
          code: 'Target 8.3: Kerja Produktif Pesisir',
          detail: 'Peningkatan ketahanan finansial keluarga nelayan tradisional.',
        },
      ],
      footerNote: 'Penerima Manfaat Langsung: >180 Nelayan Terdaftar',
      compliance: 'Kemitraan PPI',
      colSpan: 'lg:col-span-4',
    },
    {
      number: '13',
      title: 'Climate Action (Aksi Iklim)',
      badge: 'Mitigasi Metana',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      borderAccent: 'border-t-4 border-t-[#3F7E44]',
      description:
        'Mengurangi emisi gas rumah kaca akibat degradasi anaerobik biomassa laut yang membusuk di pelabuhan serta menekan jejak karbon rantai pakan impor.',
      targets: [
        {
          code: 'Target 13.2: Mitigasi Dekomposisi',
          detail: 'Pencegahan pelepasan metana (CH4) melalui stabilisasi suhu & asidifikasi.',
        },
      ],
      footerNote: 'Reduksi Pelepasan Gas: Setara Mitigasi Terukur',
      compliance: 'Dekarbonisasi Pesisir',
      colSpan: 'lg:col-span-4',
    },
  ]

  return (
    <section id="dampak-sdg" className="py-16 sm:py-24 bg-slate-50/70 border-y border-slate-200/80 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Part 1: Dampak Akumulatif & Proyeksi Ekologis */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-200 px-3.5 py-1.5 text-xs font-semibold text-sky-800 mb-3">
                <svg className="h-3.5 w-3.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m22 7-8.5 8.5-5-5L2 17" />
                  <path d="M16 7h6v6" />
                </svg>
                <span>Transparansi Metrik Nyata</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Dampak Akumulatif & Proyeksi Ekologis
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
                Hasil nyata pengukuran berbasis sensor timbangan digital dan pelacakan batch sirkular di lapangan per kuartal berjalan.
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs">
                <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>Laporan Audit Kuartal Q1 2026</span>
              </span>
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecologicalMetrics.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl bg-white p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      {item.icon}
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 block mb-1">
                    {item.value}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part 2: 5 SDGs Framework */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1.5 text-xs font-semibold text-blue-800 mb-4">
              <svg className="h-3.5 w-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              <span>Kerangka Global PBB: SDG Agenda 2030</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
              Kontribusi Nyata Terhadap 5 Tujuan Pembangunan Berkelanjutan (SDGs)
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Selaras dengan komitmen Pemerintah Indonesia dan United Nations dalam menjaga kelestarian laut, memperkuat ketahanan pangan hewani, serta memajukan taraf hidup nelayan tradisional.
            </p>
          </div>

          {/* 5 SDG Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {sdgItems.map((sdg, idx) => (
              <div
                key={idx}
                className={`${sdg.colSpan} flex flex-col justify-between rounded-3xl bg-white p-7 border border-slate-200/90 ${sdg.borderAccent} shadow-xs hover:shadow-md transition-all`}
              >
                <div>
                  {/* Top Bar: Number & Badge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-extrabold text-sm">
                        {sdg.number}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {sdg.title}
                      </h3>
                    </div>
                    <span className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full border ${sdg.badgeColor}`}>
                      {sdg.badge}
                    </span>
                  </div>

                  {/* Body description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {sdg.description}
                  </p>

                  {/* Target bullets */}
                  <div className="space-y-3 mb-6">
                    {sdg.targets.map((tgt, tIdx) => (
                      <div key={tIdx} className="rounded-xl bg-slate-50/70 p-3 border border-slate-100 text-xs">
                        <span className="font-bold text-slate-900 block mb-0.5">
                          {tgt.code}
                        </span>
                        <span className="text-slate-600 leading-relaxed">
                          {tgt.detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer status */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 font-medium">
                  <span>{sdg.footerNote}</span>
                  <span className="font-semibold text-slate-700">{sdg.compliance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
