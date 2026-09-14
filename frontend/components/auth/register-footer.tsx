'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface RegisterFooterProps {
  onOpenHelp?: () => void
}

export function RegisterFooter({ onOpenHelp }: RegisterFooterProps) {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'status' | null>(null)

  return (
    <footer id="bantuan" className="border-t border-slate-200/80 bg-white pt-16 pb-12 mt-16 text-left">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-100">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-100 shadow-2xs">
                <svg
                  className="h-6 w-6"
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
                  <circle cx="14" cy="14" r="2.5" fill="#0369A1" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
                  ByCatchLoop
                </span>
                <span className="text-[9px] font-semibold text-slate-400 tracking-widest uppercase mt-0.5">
                  MARITIME CIRCULAR
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 max-w-sm">
              Platform digital rantai pasok sirkular hasil tangkapan sampingan (by-catch) untuk ekosistem pesisir berdaya saing tinggi dan berkelanjutan.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Inisiatif Sirkular Terpadu SDG 14: Life Below Water</span>
            </div>
          </div>

          {/* Col 2: Navigasi */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/" className="hover:text-sky-600 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/#tentang" className="hover:text-sky-600 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/#cara-kerja" className="hover:text-sky-600 transition-colors">
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link href="/#dampak-sdg" className="hover:text-sky-600 transition-colors">
                  Dampak SDGs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Ekosistem */}
          <div className="lg:col-span-3 sm:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Ekosistem
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/auth/register?role=ppi" className="hover:text-sky-600 transition-colors">
                  Pelabuhan Mitra
                </Link>
              </li>
              <li>
                <Link href="/auth/register?role=ppi" className="hover:text-sky-600 transition-colors">
                  Koperasi Nelayan
                </Link>
              </li>
              <li>
                <Link href="/auth/register?role=pembeli" className="hover:text-sky-600 transition-colors">
                  Industri Pengolah
                </Link>
              </li>
              <li>
                <Link href="/#pilar" className="hover:text-sky-600 transition-colors">
                  Standar Mutu Biomassa
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Dukungan & SDGs */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Dukungan & SDGs
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 mb-5">
              <li>
                <button
                  type="button"
                  onClick={onOpenHelp}
                  className="hover:text-sky-600 transition-colors cursor-pointer text-left"
                >
                  Pusat Bantuan
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenHelp}
                  className="hover:text-sky-600 transition-colors cursor-pointer text-left"
                >
                  Kontak Logistik
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
            </ul>

            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50/80 px-3 py-2 border border-emerald-200 text-xs font-semibold text-emerald-800">
              <svg className="h-4 w-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>SDG 12 & SDG 14 Aligned</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2024 ByCatch Loop Indonesia. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Privasi
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Syarat & Ketentuan
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('status')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Status Sistem
            </button>
          </div>
        </div>
      </div>

      {/* Modal Dialog for Legal / Status */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {legalModal === 'privacy'
                  ? 'Kebijakan Privasi'
                  : legalModal === 'terms'
                  ? 'Syarat & Ketentuan'
                  : 'Status Sistem Layanan'}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Tutup dialog"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
              {legalModal === 'privacy' && (
                <>
                  <p>
                    ByCatch Loop melindungi data identitas nelayan, manifest kapal, dan tonase tangkapan sampingan sesuai standar keamanan maritim nasional.
                  </p>
                  <p>
                    Informasi lokasi pendaratan hanya dibagikan kepada pembeli industri resmi terverifikasi dan pengelola pelabuhan perikanan terkait.
                  </p>
                </>
              )}
              {legalModal === 'terms' && (
                <>
                  <p>
                    Pengguna berkewajiban melaporkan estimasi kesegaran ikan (Grade A/B/C) secara transparan berdasarkan checklist mutu terstandarisasi.
                  </p>
                  <p>
                    Lelang batch ikan sampingan terikat komitmen waktu serah terima 12 jam untuk menjaga rantai dingin optimal 2°C.
                  </p>
                </>
              )}
              {legalModal === 'status' && (
                <>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold mb-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span>Semua Sistem Beroperasi Normal</span>
                  </div>
                  <p>
                    Jaringan sinkronisasi offline dermaga: Aktif di 12 Pelabuhan Utama.
                  </p>
                  <p>
                    Server lelang batch kilat: Operasional 24/7 dengan waktu respon &lt;150ms.
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="rounded-full bg-sky-600 px-5 py-2 text-xs font-semibold text-white hover:bg-sky-700 min-h-[36px]"
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
