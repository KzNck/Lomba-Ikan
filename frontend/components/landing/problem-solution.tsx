export function ProblemSolution() {
  const linearSteps = [
    {
      num: '1',
      title: 'By-catch Tertangkap di Jaring',
      desc: 'Ikan bercampur, tidak terpilih, dan dibiarkan di dek terbuka di bawah terik matahari.',
    },
    {
      num: '2',
      title: 'Tidak Tersalurkan & Es Minim',
      desc: 'Es diprioritaskan hanya untuk ikan komersial utama; tangkapan samping membusuk dengan cepat.',
    },
    {
      num: '3',
      title: 'Rusak & Dibuang (Nilai Rp 0)',
      desc: 'Dibuang kembali ke laut mencemari bentos, atau menumpuk di dermaga menjadi limbah berbau.',
    },
  ]

  const circularSteps = [
    {
      title: 'Pencatatan Cepat di Laut',
      tag: 'Offline-Ready',
      desc: 'Nelayan mencatat estimasi kuantitas langsung saat jaring diangkat meski tanpa koneksi seluler.',
    },
    {
      title: 'Preservasi Insulasi Cold Box PPI',
      tag: 'Suhu 2°C',
      desc: 'Pendaratan langsung ke hub pendingin pelabuhan dengan rantai dingin terverifikasi sensor.',
    },
    {
      title: 'AI Grading Kualitas (A/B/C)',
      tag: 'Verifikasi Visual',
      desc: 'Sistem computer vision mengklasifikasikan kesegaran secara objektif untuk penentuan utilisasi.',
    },
    {
      title: 'Koneksi Pembeli Industri Hilir',
      tag: 'Lelang 12 Jam',
      desc: 'Pabrik pakan, silase, dan peternak lokal menawar langsung dengan kepastian serapan kuota.',
    },
    {
      title: 'Transformasi Jadi Produk Sirkular',
      tag: 'Zero Waste',
      desc: 'Biomassa bernutrisi tinggi diolah menjadi pakan bernilai tambah tanpa ada yang terbuang.',
    },
  ]

  return (
    <section id="masalah" className="py-16 sm:py-20 bg-slate-50/50 border-b border-slate-100 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-200 px-3.5 py-1.5 text-xs font-semibold text-rose-800 shadow-2xs mb-4">
            <span className="h-2 w-2 rounded-full bg-rose-500" aria-hidden="true" />
            <span>Konteks & Tantangan Maritim</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            Masalah: Ketika Potensi Tangkapan Terbuang di Laut
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Setiap hari, jutaan ton by-catch bernutrisi terbuang sia-sia karena minimnya akses pasar hilir dan ketiadaan presesi rantai dingin di dermaga kecil.
          </p>
        </div>

        {/* Warning Callout Card */}
        <div className="rounded-2xl bg-rose-50/90 border border-rose-200/80 p-5 sm:p-6 mb-12 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-950">
                  By-catch tidak selalu menjadi limbah.
                </h3>
                <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed mt-0.5">
                  Ikan non-target memiliki profil protein tinggi yang bernilai ekonomi bagi pakan budidaya, silase ternak, dan pupuk bio-organik jika ditangani tepat waktu.
                </p>
              </div>
            </div>
            <div className="shrink-0 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-rose-300 px-3.5 py-1 text-xs font-semibold text-rose-800 shadow-2xs">
                Definisi Kerugian Nutrisi
              </span>
            </div>
          </div>
        </div>

        {/* Comparison Matrix: Left (Linear) vs Right (Circular) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Column: Alur Lama (Loss of Value) */}
          <div className="flex flex-col justify-between rounded-3xl border border-rose-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-2 pb-4 mb-6 border-b border-rose-100">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Alur Lama: Praktik Linear Terbuang
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pola konvensional tanpa koneksi data dan fasilitas rantai dingin di geladak.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
                  Loss of Value
                </span>
              </div>

              {/* Step items */}
              <div className="space-y-4 mb-6">
                {linearSteps.map((step) => (
                  <div key={step.num} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-rose-50/40 border border-rose-100">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-200 text-rose-800 text-xs font-bold">
                      {step.num}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom impact note */}
            <div className="rounded-xl bg-rose-50 p-4 border border-rose-200/60 text-xs text-rose-900 leading-relaxed">
              <strong className="font-semibold text-rose-950">Dampak:</strong> Kerugian bahan baku pakan lokal masif, emisi gas metana, dan nelayan kehilangan potensi pendapatan harian.
            </div>
          </div>

          {/* Right Column: Alur ByCatch Loop (Circular Preservation) */}
          <div className="flex flex-col justify-between rounded-3xl border border-emerald-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-2 pb-4 mb-6 border-b border-emerald-100">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Alur ByCatch Loop: Sirkular & Bernilai
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pemilahan berbasis komitmen sejak di atas perahu hingga pabrik pengolah lokal.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  Circular Preservation
                </span>
              </div>

              {/* Step items */}
              <div className="space-y-3 mb-6">
                {circularSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-emerald-50/40 border border-emerald-100">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold mt-0.5">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-md bg-emerald-100/80 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                      {step.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom impact note */}
            <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200/60 text-xs text-emerald-900 leading-relaxed">
              <strong className="font-semibold text-emerald-950">Dampak Positif:</strong> Tambahan pendapatan harian nelayan, ketersediaan pakan alternatif, dan laut tetap bersih.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
