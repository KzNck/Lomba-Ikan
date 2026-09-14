'use client'

import React from 'react'

export type RoleId = 'nelayan' | 'pembeli' | 'ppi'

export interface RoleConfig {
  id: RoleId
  tag: string
  tagColor: string
  tagIcon: 'boat' | 'factory' | 'anchor'
  roleIcon: 'boat' | 'factory' | 'helm'
  iconBg: string
  title: string
  subtitle: string
  features: {
    icon: 'tap' | 'quality' | 'price' | 'clock' | 'chain' | 'supply' | 'scale' | 'cold' | 'chart'
    text: string
  }[]
  fitFor: string
  ctaText: string
}

export const ROLES: Record<RoleId, RoleConfig> = {
  nelayan: {
    id: 'nelayan',
    tag: 'Aplikasi Khusus Kapal & Dermaga',
    tagColor: 'bg-sky-50 text-sky-700 border-sky-100',
    tagIcon: 'boat',
    roleIcon: 'boat',
    iconBg: 'bg-sky-500 text-white',
    title: 'Nelayan',
    subtitle: 'Catat dan salurkan by-catch.',
    features: [
      {
        icon: 'tap',
        text: 'Input cepat ≤5 tap (mode offline di laut)',
      },
      {
        icon: 'quality',
        text: 'Estimasi kesegaran otomatis Grade A/B/C',
      },
      {
        icon: 'price',
        text: 'Dapatkan penawaran harga transparan dari pembeli industri',
      },
    ],
    fitFor: 'Cocok untuk: ABK, Juragan, Nelayan Tradisional',
    ctaText: 'Lanjutkan sebagai Nelayan',
  },
  pembeli: {
    id: 'pembeli',
    tag: 'Hilirisasi & Pengolahan',
    tagColor: 'bg-amber-50 text-amber-800 border-amber-200/70',
    tagIcon: 'factory',
    roleIcon: 'factory',
    iconBg: 'bg-amber-50 text-amber-700 border border-amber-200',
    title: 'Pembeli Industri',
    subtitle: 'Cari bahan baku.',
    features: [
      {
        icon: 'clock',
        text: 'Akses lelang kilat 12 jam batch by-catch segar',
      },
      {
        icon: 'chain',
        text: 'Keterlacakan 100% dari dermaga & audit rantai dingin',
      },
      {
        icon: 'supply',
        text: 'Pasokan berkelanjutan untuk pakan, silase, atau bio-konversi',
      },
    ],
    fitFor: 'Cocok untuk: Pabrik Tepung Ikan, Akuakultur, Biotech',
    ctaText: 'Lanjutkan sebagai Pembeli Industri',
  },
  ppi: {
    id: 'ppi',
    tag: 'Manajemen Hub & Logistik',
    tagColor: 'bg-slate-100 text-slate-700 border-slate-200',
    tagIcon: 'anchor',
    roleIcon: 'helm',
    iconBg: 'bg-emerald-600 text-white',
    title: 'Fasilitator PPI/Koperasi',
    subtitle: 'Kelola batch dan fasilitas.',
    features: [
      {
        icon: 'scale',
        text: 'Verifikasi timbangan digital & checklist mutu',
      },
      {
        icon: 'cold',
        text: 'Monitoring suhu Cold Box terintegrasi 2°C',
      },
      {
        icon: 'chart',
        text: 'Dashboard retribusi, serah terima, dan laporan pelabuhan',
      },
    ],
    fitFor: 'Cocok untuk: Pengelola TPI, Manajer KUD Bahari, UPT PPI',
    ctaText: 'Lanjutkan sebagai Fasilitator PPI/Koperasi',
  },
}

function renderTagIcon(type: 'boat' | 'factory' | 'anchor') {
  switch (type) {
    case 'boat':
      return (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 20a2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1" />
          <path d="M4 17 6.5 7h11l2.5 10" />
          <path d="M12 7V3" />
        </svg>
      )
    case 'factory':
      return (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M17 18h1" />
          <path d="M12 18h1" />
          <path d="M7 18h1" />
        </svg>
      )
    case 'anchor':
      return (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="5" r="3" />
          <line x1="12" y1="22" x2="12" y2="8" />
          <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
        </svg>
      )
  }
}

function renderRoleIcon(type: 'boat' | 'factory' | 'helm') {
  switch (type) {
    case 'boat':
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 20a2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1" />
          <path d="M4 17 6.5 8h11l2.5 9" />
          <path d="M12 8V4" />
          <path d="M8 8l4-4 4 4" />
        </svg>
      )
    case 'factory':
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 21V9l7 4V9l7 4v8" />
          <path d="M3 21h18" />
          <path d="M19 21V5a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2v16" />
          <rect x="7" y="15" width="2" height="2" />
        </svg>
      )
    case 'helm':
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="3" x2="12" y2="9" />
          <line x1="12" y1="15" x2="12" y2="21" />
          <line x1="3" y1="12" x2="9" y2="12" />
          <line x1="15" y1="12" x2="21" y2="12" />
        </svg>
      )
  }
}

function renderFeatureIcon(type: RoleConfig['features'][0]['icon']) {
  switch (type) {
    case 'tap':
      return (
        <svg className="h-4 w-4 shrink-0 text-sky-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 8 8 12 12 16" />
          <line x1="16" y1="12" x2="8" y2="12" />
        </svg>
      )
    case 'quality':
      return (
        <svg className="h-4 w-4 shrink-0 text-sky-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      )
    case 'price':
      return (
        <svg className="h-4 w-4 shrink-0 text-sky-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      )
    case 'clock':
      return (
        <svg className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 6 12 12 15 15" />
        </svg>
      )
    case 'chain':
      return (
        <svg className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      )
    case 'supply':
      return (
        <svg className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      )
    case 'scale':
      return (
        <svg className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="M7 21h10" />
          <path d="M12 3v18" />
          <path d="M3 7h18" />
        </svg>
      )
    case 'cold':
      return (
        <svg className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
        </svg>
      )
    case 'chart':
      return (
        <svg className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="12" width="4" height="9" rx="1" />
          <rect x="10" y="7" width="4" height="14" rx="1" />
          <rect x="17" y="3" width="4" height="18" rx="1" />
        </svg>
      )
  }
}

interface RoleCardProps {
  role: RoleConfig
  isSelected: boolean
  onSelect: (id: RoleId) => void
}

export function RoleCard({ role, isSelected, onSelect }: RoleCardProps) {
  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={() => onSelect(role.id)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          onSelect(role.id)
        }
      }}
      className={`relative rounded-3xl bg-white p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 ${
        isSelected
          ? 'border-2 border-sky-500 ring-4 ring-sky-500/10 shadow-lg'
          : 'border border-slate-200/90 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Top Tag & Selection Indicator Row */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-5">
          {/* Operational Area Tag */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${role.tagColor}`}
          >
            {renderTagIcon(role.tagIcon)}
            <span>{role.tag}</span>
          </span>

          {/* Radio / Checkmark indicator */}
          <div
            className={`h-5 w-5 rounded-full flex items-center justify-center transition-colors shrink-0 ${
              isSelected
                ? 'bg-sky-600 text-white'
                : 'border-2 border-slate-300 bg-white'
            }`}
            aria-hidden="true"
          >
            {isSelected && (
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>

        {/* Role Icon */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-2xs mb-4 ${role.iconBg}`}
        >
          {renderRoleIcon(role.roleIcon)}
        </div>

        {/* Title and Tagline */}
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {role.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-5">
          {role.subtitle}
        </p>

        {/* Feature points */}
        <ul className="space-y-3 mb-6" aria-label={`Fitur untuk ${role.title}`}>
          {role.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
              {renderFeatureIcon(feature.icon)}
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Card Footer: Target Audience & Selection Pill */}
      <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
        <p className="text-[11px] text-slate-500 leading-snug max-w-[175px]">
          {role.fitFor}
        </p>

        <button
          type="button"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(role.id)
          }}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all shrink-0 min-h-[36px] flex items-center justify-center ${
            isSelected
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
          }`}
          aria-label={isSelected ? `${role.title} sudah dipilih` : `Pilih peran ${role.title}`}
        >
          {isSelected ? '✓ Dipilih' : 'Pilih'}
        </button>
      </div>
    </div>
  )
}
