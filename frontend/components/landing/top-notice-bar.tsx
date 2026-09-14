export function TopNoticeBar() {
  return (
    <aside aria-label="Pengumuman Jaringan Pelabuhan" className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 text-xs font-medium text-amber-900 transition-colors">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
          <span>
            <strong className="font-semibold">Jaringan Berjalan di Pesisir Pelabuhan:</strong> Selat Bali, Pantura, & Teluk Lampung
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-200 rounded-full px-2.5 py-0.5">
          <svg className="h-3 w-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Terverifikasi PPI & KKP Terpadu</span>
        </div>
      </div>
    </aside>
  )
}
