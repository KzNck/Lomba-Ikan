// All copy and imagery for the "Tambah Tangkapan" modal. Edit here to swap content without touching layout.
import type { CategoryOptionContent } from '@/components/nelayan/category-option'
import type { IconOptionContent } from '@/components/nelayan/icon-option'

export const CATCH_MODAL = {
  title: 'Tambah Tangkapan',
  subtitle: 'Catat hasil tangkapan hari ini dalam 5 langkah singkat.',
  closeHref: '/nelayan',
  closeLabel: 'Tutup',
  steps: ['Kategori', 'Volume', 'Waktu', 'Es', 'Foto'],
}

export const CATEGORY_STEP = {
  title: 'Pilih Kategori Tangkapan',
  description: 'Pilih satu jenis yang paling banyak di tangkapan Anda.',
  // Category art is decorative (each card is labelled), so the images carry no alt text.
  options: [
    { value: 'campuran', label: 'Campuran', image: '/images/nelayan/kategori/campuran.jpg' },
    { value: 'teri', label: 'Teri', image: '/images/nelayan/kategori/teri.jpg' },
    { value: 'udang', label: 'Udang', image: '/images/nelayan/kategori/udang.jpg' },
    { value: 'cumi-cumi-sotong', label: 'Cumi-cumi / Sotong', image: '/images/nelayan/kategori/cumi-cumi-sotong.jpg' },
    { value: 'ikan-pelagis-kecil', label: 'Ikan Pelagis Kecil', image: '/images/nelayan/kategori/ikan-pelagis-kecil.jpg' },
    { value: 'ikan-demersal', label: 'Ikan Demersal', image: '/images/nelayan/kategori/ikan-demersal.jpg' },
    { value: 'rajungan', label: 'Rajungan', image: '/images/nelayan/kategori/rajungan.jpg' },
    { value: 'lainnya', label: 'Lainnya', icon: 'ellipsis' },
  ] satisfies CategoryOptionContent[],
  // Shown when "Lanjut" is pressed with nothing selected.
  error: 'Pilih satu kategori untuk melanjutkan.',
  info: 'Tangkapan terdiri dari beberapa jenis? Pilih Campuran. Anda bisa mengubah kategori sebelum listing dipasang.',
  cancel: { href: '/nelayan', label: 'Batal' },
  submitLabel: 'Lanjut',
}

export const VOLUME_STEP = {
  title: 'Berapa Banyak Tangkapan?',
  description: 'Masukkan perkiraan berat tangkapan dalam kilogram (kg).',
  unit: 'kg',
  min: 0,
  max: 200,
  minValid: 1,
  // Starts empty so the weight is always entered, never accepted as a pre-filled guess.
  initialValue: 0,
  decreaseLabel: 'Kurangi 1 kg',
  increaseLabel: 'Tambah 1 kg',
  // Shown when "Lanjut" is pressed below `minValid`.
  error: 'Masukkan berat minimal 1 kg.',
  info: 'Perkiraan saja, tidak perlu tepat.',
  backLabel: 'Kembali',
  submitLabel: 'Lanjut',
}

export const TIME_STEP = {
  name: 'waktu',
  title: 'Kapan Tangkapan Ini Ditarik?',
  description: 'Pilih waktu jaring ditarik. Ini membantu memperkirakan kesegaran.',
  options: [
    { value: 'pagi', label: 'Pagi ini', icon: 'sunrise' },
    { value: 'siang', label: 'Siang ini', icon: 'sun' },
    { value: 'sore', label: 'Sore ini', icon: 'sunset' },
    { value: 'kemarin-malam', label: 'Kemarin malam', icon: 'moon' },
  ] satisfies IconOptionContent[],
  // Shown when "Lanjut" is pressed with nothing selected. Not in the export; worded after step 1's message.
  error: 'Pilih waktu jaring ditarik untuk melanjutkan.',
  backLabel: 'Kembali',
  submitLabel: 'Lanjut',
}

export const ICE_STEP = {
  name: 'es',
  title: 'Bagaimana Kondisi Esnya?',
  description: 'Pilih yang paling mendekati kondisi tangkapan saat ini.',
  options: [
    { value: 'banyak', label: 'Banyak Es', description: 'Tangkapan tertutup es', icon: 'snowflake' },
    { value: 'sedikit', label: 'Sedikit Es', description: 'Es hanya sebagian', icon: 'thermometer-snowflake' },
    { value: 'tanpa', label: 'Tanpa Es', description: 'Tidak memakai es', icon: 'thermometer-sun' },
  ] satisfies IconOptionContent[],
  // Shown when "Lanjut" is pressed with nothing selected. Not in the export; worded after step 1's message.
  error: 'Pilih kondisi es untuk melanjutkan.',
  backLabel: 'Kembali',
  submitLabel: 'Lanjut',
}

export const PHOTO_STEP = {
  title: 'Foto Tangkapan',
  description: 'Foto dari atas agar seluruh tangkapan terlihat. Foto dipakai untuk memperkirakan grade.',
  // Accessible name for the "Metode Foto" toggle (not shown).
  methodLabel: 'Cara menambahkan foto',
  methods: { webcam: 'Ambil dari Webcam', upload: 'Unggah Foto' },
  webcamOff: {
    title: 'Belum ada foto',
    description: 'Nyalakan webcam lalu arahkan ke tangkapan dari atas, atau pilih Unggah Foto.',
    action: 'Nyalakan webcam',
  },
  webcamDenied: {
    title: 'Webcam tidak bisa diakses',
    description: 'Izinkan akses kamera di pengaturan browser, lalu coba lagi. Anda juga bisa memilih Unggah Foto.',
    action: 'Coba lagi',
  },
  // Not in the export: the live camera view, and "Unggah Foto" before a file is chosen.
  webcamLive: { videoLabel: 'Tampilan webcam', caption: 'Arahkan webcam ke tangkapan dari atas.', action: 'Ambil foto' },
  uploadEmpty: { title: 'Belum ada foto', description: 'Pilih foto tangkapan yang diambil dari atas.', action: 'Pilih foto' },
  preview: {
    alt: 'Foto tangkapan',
    // Followed by the time, e.g. "Foto diambil pukul 07.42".
    takenCaption: 'Foto diambil pukul',
    uploadedCaption: 'Foto diunggah pukul',
    retake: 'Ambil ulang',
    // Not in the export: the same button in "Unggah Foto" mode.
    replace: 'Ganti foto',
  },
  // Shown when "Analisis foto" is pressed without a photo. Not in the export; worded after step 1's message.
  error: 'Ambil atau unggah foto untuk melanjutkan.',
  savedOffline: 'Foto tersimpan di perangkat. Analisis berjalan otomatis saat perangkat kembali online.',
  analyzing: { title: 'Menganalisis foto…', description: 'Mohon tunggu sebentar. Jangan tutup halaman ini.' },
  backLabel: 'Kembali',
  submitLabel: 'Analisis foto',
}
