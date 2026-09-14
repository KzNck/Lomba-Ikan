'use client'

import { useState, useEffect } from 'react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('nelayan')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setName('')
      setEmail('')
      setMessage('')
      setSubmitted(false)
      onClose()
    }, 2500)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
          aria-label="Tutup modal kontak"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pesan Berhasil Terkirim!</h3>
            <p className="text-sm text-slate-600">
              Tim kemitraan ByCatch Loop akan segera menghubungi Anda dalam waktu 1x24 jam kerja.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="inline-block rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 mb-2">
                Hubungi Kami
              </span>
              <h3 id="contact-modal-title" className="text-2xl font-bold text-slate-900">
                Konsultasi Integrasi Pelabuhan
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Kembangkan rantai dingin dan hilirisasi by-catch di wilayah maritim Anda.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium text-slate-700 mb-1">
                  Alamat Email / WhatsApp
                </label>
                <input
                  id="contact-email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi@pelabuhan.go.id atau 081234567890"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label htmlFor="contact-role" className="block text-xs font-medium text-slate-700 mb-1">
                  Kategori Peran
                </label>
                <select
                  id="contact-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white"
                >
                  <option value="nelayan">Nelayan / Kelompok Usaha Bersama (KUB)</option>
                  <option value="pembeli">Industri Pengolahan / Pabrik Pakan</option>
                  <option value="ppi">Pengelola Pelabuhan / PPI / Koperasi Perikanan</option>
                  <option value="pemerintah">Dinas Kelautan & Perikanan / Akademisi</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-medium text-slate-700 mb-1">
                  Kebutuhan atau Pertanyaan
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ceritakan pelabuhan atau estimasi tonase by-catch yang ingin dioptimalkan..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 resize-none"
                />
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
                  Kirim Pesan
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
