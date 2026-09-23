// lib/notification-topics.ts
//
// Jenis kabar di lonceng header per peran, untuk "Akun › Notifikasi". Terpisah dari lib/notification-settings.ts
// (yang membaca sesi dan menulis ke Supabase) supaya form di browser bisa memakainya tanpa menarik kode server.

/** Jenis kabar per peran. Urutannya urutan di halaman Notifikasi. */
export const NOTIFICATION_TOPICS = {
    // Listing baru yang cocok dengan Preferensi; pembaruan pesanan (diklaim, selesai, dibatalkan).
    pembeli: ['newListings', 'orders'],
    // Pembelian batch (diklaim, dijadwalkan, diterima, terjual, dibatalkan); status listing (tayang, segera
    // berakhir, berakhir).
    nelayan: ['sales', 'listings'],
} as const

export type NotificationRole = keyof typeof NOTIFICATION_TOPICS
export type NotificationTopic = (typeof NOTIFICATION_TOPICS)[NotificationRole][number]
export type NotificationSettings = Record<NotificationTopic, boolean>
