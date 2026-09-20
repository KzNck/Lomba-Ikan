// All copy for the "Hasil Kesegaran" modal. Edit here to swap content without touching layout.
// The grading itself comes from the Freshness API — see lib/freshness/client.ts — and the
// recommendations from lib/catches/recommendations.ts.

export const FRESHNESS_MODAL = {
  title: 'Hasil Kesegaran',
  subtitle: 'Berikut hasil analisis kesegaran dari foto yang Anda unggah.',
  closeHref: '/nelayan',
  closeLabel: 'Tutup',
  disclaimer: 'Estimasi indikatif dari AI, bukan sertifikasi mutu pangan. Tetap cek manual di PPI.',
  submitLabel: 'Pasang ke listing',
}

export const GRADE_PANEL = {
  gradeLabel: 'Grade',
  summaryTitle: 'Ringkasan Hasil',
  metricLabels: { freshness: 'Estimasi kesegaran', temperature: 'Suhu Estimasi' },
}

export const USAGE_RECOMMENDATIONS = {
  title: 'Rekomendasi Penggunaan',
  subtitle: 'Komoditas ini cocok untuk industri hilir berikut:',
}

export const PRICE_FIELD = {
  name: 'harga',
  label: 'Harga Jual',
  helper: 'Opsional. Kosongkan untuk mengikuti harga lelang.',
  prefix: 'Rp',
  suffix: '/ kg',
  // Suggested price, filled per catch from the going rate for its category.
  defaultValue: '',
  marketLabel: 'Harga pasar rata-rata',
  marketRange: 'Rp 7.000–10.000/kg',
}
