import Link from 'next/link'

export default function NelayanDashboardPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 mb-6 shadow-xs">
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6-3.56 0-7.56-2.54-8.5-6Z" />
          <path d="M18 12v.5" />
          <path d="M16 17.93a12.6 12.6 0 0 1-5.07-4.32" />
          <path d="M2 12h4.5" />
        </svg>
      </div>

      <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-800 mb-3">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        <span>Tahap Integrasi Pelabuhan</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
        Dashboard Nelayan & Nakhoda
      </h1>

      <p className="text-sm text-slate-600 max-w-md mb-8 leading-relaxed">
        Fitur pencatatan tangkapan offline-ready di tengah laut dan nota timbang PPI sedang dalam tahap finalisasi audit bersama mitra koperasi nelayan.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
      >
        <span aria-hidden="true">←</span>
        <span>Kembali ke Beranda</span>
      </Link>
    </div>
  )
}
