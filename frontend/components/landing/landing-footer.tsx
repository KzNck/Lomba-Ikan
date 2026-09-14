'use client'

import { useState } from 'react'
import Link from 'next/link'

interface LandingFooterProps {
  onOpenContact: () => void
}

export function LandingFooter({ onOpenContact }: LandingFooterProps) {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null)

  return (
    <footer id="bantuan" className="border-t border-slate-200/80 bg-white pt-16 pb-12 scroll-mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-100 text-left">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M14 4C8.477 4 4 8.477 4 14C4 16.761 5.119 19.261 6.929 21.071L9.05 18.95C7.79 17.69 7 15.94 7 14C7 10.134 10.134 7 14 7C16.895 7 19.381 8.752 20.45 11.23L23.21 10.03C21.68 6.51 18.13 4 14 4Z"
                    fill="#0284C7"
                  />
                  <path
                    d="M14 24C19.523 24 24 19.523 24 14C24 11.239 22.881 8.739 21.071 6.929L18.95 9.05C20.21 10.31 21 12.06 21 14C21 17.866 17.866 21 14 21C11.105 21 8.619 19.248 7.55 16.77L4.79 17.97C6.32 21.49 9.87 24 14 24Z"
                    fill="#0EA5E9"
                  />
                  <circle cx="14" cy="14" r="2" fill="#0369A1" />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">ByCatch Loop</span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 max-w-sm">
              Platform digital rantai pasok sirkular hasil tangkapan sampingan (by-catch) untuk ekosistem pakan budidaya yang tinggi dan berkelanjutan.
            </p>

            <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800 mb-2">
              <svg className="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Inisiatif Terpadu SDG 14: Life Below Water</span>
            </div>
          </div>

          {/* Col 2: Navigasi */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              NAVIGASI
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/" className="hover:text-sky-600 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="#masalah" className="hover:text-sky-600 transition-colors">
                  Tantangan Maritim
                </Link>
              </li>
              <li>
                <Link href="#pilar" className="hover:text-sky-600 transition-colors">
                  Pilar & Alur Sirkular
                </Link>
              </li>
              <li>
                <Link href="#cara-kerja" className="hover:text-sky-600 transition-colors">
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link href="#dampak-sdg" className="hover:text-sky-600 transition-colors">
                  Dampak SDGs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Ekosistem */}
          <div className="lg:col-span-3 sm:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              EKOSISTEM
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="#kemitraan" className="hover:text-sky-600 transition-colors">
                  Pelabuhan Mitra (Muncar)
                </Link>
              </li>
              <li>
                <Link href="/auth/register?role=ppi" className="hover:text-sky-600 transition-colors">
                  Koperasi Nelayan & PPI
                </Link>
              </li>
              <li>
                <Link href="/auth/register?role=pembeli" className="hover:text-sky-600 transition-colors">
                  Industri Pengolah Pakan
                </Link>
              </li>
              <li>
                <Link href="#pilar" className="hover:text-sky-600 transition-colors">
                  Standar Mutu Biomassa (A/B/C)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Dukungan & SDGs */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              DUKUNGAN & SDGS
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 mb-4">
              <li>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="hover:text-sky-600 transition-colors cursor-pointer text-left"
                >
                  Pusat Bantuan & Kemitraan
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModal('privacy')}
                  className="hover:text-sky-600 transition-colors cursor-pointer text-left"
                >
                  Kebijakan Privasi
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModal('terms')}
                  className="hover:text-sky-600 transition-colors cursor-pointer text-left"
                >
                  Syarat & Ketentuan
                </button>
              </li>
            </ul>

            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 p-2.5 border border-slate-200 text-xs text-slate-700 font-semibold">
              <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>SDG 12 & SDG 14 Aligned</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 ByCatch Loop Indonesia. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Kebijakan Privasi
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Syarat & Ketentuan
            </button>
          </div>
        </div>
      </div>

      {/* Legal Dialog Modal */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 text-left">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              {legalModal === 'privacy' ? 'Kebijakan Privasi' : 'Syarat & Ketentuan'}
            </h3>
            <div className="text-xs text-slate-600 leading-relaxed space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
              <p>
                ByCatch Loop menjamin keamanan data pelayaran, pencatatan tangkapan nelayan, dan transaksi lelang industri sesuai standar pelindungan data nasional.
              </p>
              <p>
                Seluruh data tonase dan suhu rantai dingin PPI diaudit secara terenkripsi untuk kebutuhan ketertelusuran maritim dan standardisasi mutu perikanan.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}
