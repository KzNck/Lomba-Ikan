// lib/catches/recommendations.ts
//
// "Rekomendasi Penggunaan" di modal Hasil Kesegaran. Belum ada kolomnya di
// database, jadi disusun dari kategori dan grade tangkapan — sejalan dengan
// `usageLabel` di present.ts, tapi lengkap dengan ikon dan penjelasannya.

import type { UsageOptionContent } from '@/components/nelayan/usage-option'
import { gradeCondition } from './present'
import type { Catch } from '@/types/database'

/** Katalog jalur hilirisasi yang dikenal, dipakai ulang antar kategori. */
const USE: Record<string, UsageOptionContent> = {
  maggot: {
    icon: 'bug',
    title: 'Pakan Maggot (BSF)',
    description: 'Kandungan protein tinggi, ideal untuk pakan larva BSF.',
  },
  silase: {
    icon: 'factory',
    title: 'Silase Ikan',
    description: 'Dapat difermentasi dengan baik untuk pakan ternak.',
  },
  pupuk: {
    icon: 'sprout',
    title: 'Pupuk Organik Cair',
    description: 'Kaya unsur hara, cocok untuk pupuk cair organik.',
  },
  tepung: {
    icon: 'factory',
    title: 'Tepung Ikan',
    description: 'Bahan baku pakan ternak dan budidaya perikanan.',
  },
  terasi: {
    icon: 'factory',
    title: 'Terasi',
    description: 'Difermentasi jadi terasi, jalur klasik untuk udang kecil.',
  },
  umpan: {
    icon: 'fish',
    title: 'Umpan Pancing',
    description: 'Dijual sebagai umpan untuk kapal pancing di sekitar PPI.',
  },
  konsumsi: {
    icon: 'utensils',
    title: 'Konsumsi Langsung',
    description: 'Masih layak dijual segar untuk pasar konsumsi.',
  },
  asin: {
    icon: 'sun',
    title: 'Ikan Asin',
    description: 'Diawetkan dengan garam dan dijemur, tahan disimpan lama.',
  },
  pakanTernak: {
    icon: 'factory',
    title: 'Pakan Ternak',
    description: 'Diolah jadi campuran pakan unggas dan ikan budidaya.',
  },
}

const BY_CATEGORY: Record<string, { live: string[]; dead: string[] }> = {
  campuran: { live: ['konsumsi', 'asin', 'silase'], dead: ['maggot', 'silase', 'pupuk'] },
  teri: { live: ['konsumsi', 'asin', 'terasi'], dead: ['terasi', 'pakanTernak', 'maggot'] },
  udang: { live: ['konsumsi', 'terasi', 'asin'], dead: ['terasi', 'pakanTernak', 'maggot'] },
  'cumi-cumi-sotong': { live: ['konsumsi', 'umpan', 'asin'], dead: ['umpan', 'tepung', 'maggot'] },
  'ikan-pelagis-kecil': { live: ['konsumsi', 'asin', 'tepung'], dead: ['asin', 'tepung', 'maggot'] },
  'ikan-demersal': { live: ['konsumsi', 'asin', 'silase'], dead: ['silase', 'pupuk', 'maggot'] },
  rajungan: { live: ['konsumsi', 'tepung', 'pakanTernak'], dead: ['tepung', 'pakanTernak', 'pupuk'] },
}

const FALLBACK = { live: ['konsumsi', 'silase', 'pupuk'], dead: ['maggot', 'silase', 'pupuk'] }

/** Tiga jalur teratas untuk satu tangkapan. */
export function recommendationsFor(entry: Pick<Catch, 'species' | 'freshness_grade'>): UsageOptionContent[] {
  const options = BY_CATEGORY[entry.species] ?? FALLBACK
  return options[gradeCondition(entry.freshness_grade)].map((key) => USE[key])
}
