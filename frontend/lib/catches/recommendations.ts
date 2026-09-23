// "Rekomendasi Penggunaan": kartu jalur hilirisasi untuk satu tangkapan, dipakai
// di modal Hasil Kesegaran, drawer Detail Listing, dan marketplace pembeli.
//
// Kartunya mengikuti grade, sejalan dengan kalimat rekomendasi dari Freshness
// API (HILIRISASI_MAP di freshness-api/app/models/guardrail.py): A2–A3 pakan
// basah dan silase, B1 silase dan tepung ikan, B2 maggot, B3 hanya pupuk. Jadi
// kartu tidak pernah menyarankan hal yang tidak disarankan model.
//
// Hanya jalur industri hilir sirkular (maggot, silase, pupuk, tepung/pakan)
// plus lepas kembali — tidak ada jalur konsumsi: grade ini estimasi indikatif,
// bukan sertifikasi mutu pangan (fisherman-design/designv2.md §0.6, screens.md
// layar 12). Teksnya di `common.uses`.

import type { UsageOptionContent } from '@/components/nelayan/usage-option'
import type { Presenter } from './present'
import type { Catch, FreshnessGrade } from '@/types/database'

const USE_ICONS = {
  lepas: 'sailboat',
  pakanBasah: 'package',
  silase: 'factory',
  tepung: 'factory',
  maggot: 'bug',
  pupuk: 'sprout',
  kompos: 'leaf',
} as const satisfies Record<string, UsageOptionContent['icon']>

type Use = keyof typeof USE_ICONS

/** Urutan = yang paling disarankan lebih dulu. Jalur untuk grade yang lebih rendah selalu tetap boleh. */
const BY_GRADE: Record<FreshnessGrade, Use[]> = {
  // Model juga menyarankan konsumsi lokal untuk A1; produk ini tidak membuat klaim mutu pangan, jadi tidak dipakai.
  A1: ['lepas', 'silase', 'tepung'],
  A2: ['pakanBasah', 'silase'],
  A3: ['silase', 'pakanBasah'],
  B1: ['silase', 'tepung', 'maggot'],
  B2: ['maggot', 'pupuk'],
  B3: ['pupuk', 'kompos'],
}

/** Jalur untuk satu tangkapan, paling disarankan dulu. Kosong kalau belum dinilai. */
export function usesFor(entry: Pick<Catch, 'freshness_grade'>): Use[] {
  return entry.freshness_grade ? BY_GRADE[entry.freshness_grade] : []
}

/** Kartu "Rekomendasi Penggunaan" di modal Hasil Kesegaran. */
export function recommendationsFor(
  { t }: Presenter,
  entry: Pick<Catch, 'freshness_grade'>
): UsageOptionContent[] {
  return usesFor(entry).map((key) => ({
    icon: USE_ICONS[key],
    title: t(`uses.${key}.title`),
    description: t(`uses.${key}.description`),
  }))
}

/** "Pupuk Organik Cair · Kompos" — judul kartunya dalam satu baris, untuk drawer dan marketplace. */
export function usageOptionsLabel(p: Presenter, entry: Pick<Catch, 'freshness_grade'>): string {
  return recommendationsFor(p, entry)
    .map((option) => option.title)
    .join(' · ')
}
