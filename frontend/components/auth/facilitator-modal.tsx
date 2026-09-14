'use client'

import React, { useEffect } from 'react'

interface FacilitatorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FacilitatorModal({ isOpen, onClose }: FacilitatorModalProps) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="facilitator-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-7 sm:p-9 shadow-2xl border border-slate-200 text-left">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h3 id="facilitator-title" className="text-lg font-bold text-slate-900">
                Pusat Bantuan Fasilitator
              </h3>
              <p className="text-xs text-slate-500">
                Pendampingan registrasi pelabuhan & kapal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Tutup modal bantuan fasilitator"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 mb-7 text-xs sm:text-sm text-slate-600">
          <p className="leading-relaxed">
            Jika Anda membutuhkan panduan langsung untuk pendaftaran akun nelayan, pabrik pembeli, atau pengelola koperasi pelabuhan, tim fasilitator kami siap mendampingi:
          </p>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-start gap-3">
              <span className="font-bold text-slate-900 shrink-0 w-24">Hotline PPI:</span>
              <span className="text-slate-700 font-medium">+62 811-2345-6789 (Senin - Sabtu, 06:00 - 18:00 WIB)</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-slate-900 shrink-0 w-24">WhatsApp:</span>
              <a
                href="https://wa.me/6281123456789"
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 hover:underline font-medium"
              >
                Chat WhatsApp Fasilitator Lapangan
              </a>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-slate-900 shrink-0 w-24">Surel Resmi:</span>
              <a
                href="mailto:fasilitator@bycatchloop.id"
                className="text-sky-600 hover:underline font-medium"
              >
                fasilitator@bycatchloop.id
              </a>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Fasilitator lapangan di PPI Muara Baru, TPI Brondong, dan PPS Cilacap dapat membantu registrasi langsung di posko timbang.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-sky-600 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-sky-700 transition-colors min-h-[44px]"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  )
}
