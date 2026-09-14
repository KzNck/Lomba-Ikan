'use client'

import { useState, useEffect } from 'react'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const [email, setEmail] = useState('')
  const [org, setOrg] = useState('')
  const [downloaded, setDownloaded] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault()
    setDownloaded(true)
    setTimeout(() => {
      setDownloaded(false)
      setEmail('')
      setOrg('')
      onClose()
    }, 3000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 text-left">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
          aria-label="Tutup dialog laporan"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {downloaded ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Laporan Sedang Diunduh!
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ringkasan Audit Dampak Ekologis & Metrik Kuartal Q1 2026 telah dikirimkan ke alamat email Anda.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 mb-2 border border-emerald-200">
                Dokumentasi Terbuka
              </span>
              <h3 id="report-modal-title" className="text-2xl font-bold text-slate-900">
                Unduh Laporan Dampak & Metrik
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Akses laporan lengkap tonase biomassa terselamatkan, reduksi emisi CO2e, dan audit transparansi lelang digital ByCatch Loop.
              </p>
            </div>

            <form onSubmit={handleDownload} className="space-y-4">
              <div>
                <label htmlFor="report-email" className="block text-xs font-medium text-slate-700 mb-1">
                  Alamat Email Institusi / Pribadi
                </label>
                <input
                  id="report-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@organisasi.id"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label htmlFor="report-org" className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lembaga / Koperasi / Perusahaan
                </label>
                <input
                  id="report-org"
                  type="text"
                  required
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  placeholder="Contoh: Koperasi Nelayan / PT Pakan Nusantara"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1">
                  <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>Format: PDF Ringkasan Eksekutif (8 Halaman)</span>
                </div>
                <span>Mencakup data lapangan Pelabuhan Muncar, verifikasi rantai dingin 2°C, dan analisis 5 target SDGs.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-700 transition-colors"
                >
                  Unduh Dokumen
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
