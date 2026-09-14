import Link from 'next/link'

export function RoleEcosystem() {
  const roles = [
    {
      id: 'nelayan',
      category: 'MITRA BAHARI',
      title: 'Saya Nelayan',
      subtitle: 'Catat hasil tangkapan dan temukan pembeli sebelum sandar di dermaga.',
      headerBorder: 'border-t-4 border-t-sky-500',
      iconBg: 'bg-sky-50 text-sky-600',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6-3.56 0-7.56-2.54-8.5-6Z" />
          <path d="M18 12v.5" />
          <path d="M16 17.93a12.6 12.6 0 0 1-5.07-4.32" />
          <path d="M2 12h4.5" />
        </svg>
      ),
      benefits: [
        'Tambahan pendapatan terjamin dari ikan rucah sampingan',
        'Tetap berfungsi offline di tengah laut saat melaut',
        'Penimbangan dan penerimaan transparan langsung di PPI',
      ],
      buttonLabel: 'Daftar sebagai Nelayan',
      buttonClass: 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs',
      href: '/auth/register?role=nelayan',
    },
    {
      id: 'pembeli',
      category: 'HILIRISASI & INDUSTRI',
      title: 'Saya Pembeli',
      subtitle: 'Temukan bahan baku biomassa segar terstandar yang sesuai kebutuhan pabrik.',
      headerBorder: 'border-t-4 border-t-slate-800',
      iconBg: 'bg-slate-100 text-slate-800',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M18 16h2" />
        </svg>
      ),
      benefits: [
        'Pasokan bahan baku silase & tepung pakan kontinu dan terjamin',
        'Estimasi mutu berbasis AI & histori rantai es transparan',
        'Jadwal penjemputan terintegrasi dengan hub cold box pelabuhan',
      ],
      buttonLabel: 'Daftar sebagai Pembeli',
      buttonClass: 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs',
      href: '/auth/register?role=pembeli',
    },
    {
      id: 'ppi',
      category: 'FASILITATOR DERMAGA',
      title: 'Saya PPI/Koperasi',
      subtitle: 'Kelola batch by-catch masuk dan optimalkan fasilitas cold-box pelabuhan.',
      headerBorder: 'border-t-4 border-t-slate-400',
      iconBg: 'bg-slate-100 text-slate-600',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
      benefits: [
        'Manajemen batch masuk & keluar dermaga secara real-time',
        'Monitoring suhu fasilitas cold chain & kuota es otomatis',
        'Laporan volume tonase tangkapan & retribusi terdata rapi',
      ],
      buttonLabel: 'Daftar sebagai PPI',
      buttonClass: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200',
      href: '/auth/register?role=ppi',
    },
  ]

  return (
    <section id="tentang" className="py-16 sm:py-24 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-200 px-3.5 py-1.5 text-xs font-semibold text-sky-800 shadow-2xs mb-4">
          <svg className="h-3.5 w-3.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
          <span>Ekosistem Kolaboratif</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
          Dibuat untuk Seluruh Rantai Maritim
        </h2>

        {/* Section Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-14 leading-relaxed">
          Pilih cara Anda berkontribusi dalam ekonomi sirkular kelautan dan raih nilai optimal di setiap kilogram.
        </p>

        {/* 3 Role Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`flex flex-col justify-between rounded-2xl bg-white border border-slate-200/90 ${role.headerBorder} p-6 sm:p-8 shadow-xs hover:shadow-md transition-all`}
            >
              <div>
                {/* Header with Icon and Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl ${role.iconBg}`}>
                    {role.icon}
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                      {role.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">
                      {role.title}
                    </h3>
                  </div>
                </div>

                {/* Subtitle Value Proposition */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {role.subtitle}
                </p>

                {/* Checkpoint list */}
                <ul className="space-y-3.5 mb-8" aria-label={`Keuntungan ${role.title}`}>
                  {role.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600 border border-sky-200 mt-0.5">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="leading-snug">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div>
                <Link
                  href={role.href}
                  className={`flex items-center justify-center gap-2 w-full rounded-xl py-3 px-4 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 ${role.buttonClass}`}
                >
                  <span>{role.buttonLabel}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
