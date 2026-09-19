// All copy for the "Hasil Kesegaran" modal. Edit here to swap content without touching layout.
// `result` is the export's sample grading until the photo analysis returns real figures.
import type { FreshnessResult } from '@/components/nelayan/grade-panel'
import type { UsageOptionContent } from '@/components/nelayan/usage-option'

export const FRESHNESS_MODAL = {
  title: 'Hasil Kesegaran',
  subtitle: 'Berikut hasil analisis kesegaran dari foto yang Anda unggah.',
  closeHref: '/nelayan',
  closeLabel: 'Tutup',
  disclaimer: 'Estimasi indikatif dari AI, bukan sertifikasi mutu pangan. Tetap cek manual di PPI.',
  submitLabel: 'Pasang ke listing',
}

export const FRESHNESS_RESULT = {
  grade: 'A1',
  condition: 'Hidup, Bagus',
  freshness: 92,
  temperature: '12–16°C',
} satisfies FreshnessResult

export const GRADE_PANEL = {
  gradeLabel: 'Grade',
  summaryTitle: 'Ringkasan Hasil',
  metricLabels: { freshness: 'Estimasi kesegaran', temperature: 'Suhu Estimasi' },
}

export const USAGE_RECOMMENDATIONS = {
  title: 'Rekomendasi Penggunaan',
  subtitle: 'Komoditas ini cocok untuk industri hilir berikut:',
  options: [
    { icon: 'bug', title: 'Pakan Maggot (BSF)', description: 'Kandungan protein tinggi, ideal untuk pakan larva BSF.' },
    { icon: 'factory', title: 'Silase Ikan', description: 'Dapat difermentasi dengan baik untuk pakan ternak.' },
    { icon: 'sprout', title: 'Pupuk Organik Cair', description: 'Kaya unsur hara, cocok untuk pupuk cair organik.' },
  ] satisfies UsageOptionContent[],
}

export const PRICE_FIELD = {
  name: 'harga',
  label: 'Harga Jual',
  helper: 'Opsional. Kosongkan untuk mengikuti harga lelang.',
  prefix: 'Rp',
  suffix: '/ kg',
  // Pre-filled suggestion from the export; the seller can change or clear it.
  defaultValue: '8.000',
  marketLabel: 'Harga pasar rata-rata',
  marketRange: 'Rp 7.000–10.000/kg',
}
