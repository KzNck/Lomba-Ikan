// lib/notification-settings.ts
//
// Pengaturan "Akun › Notifikasi": jenis kabar mana yang tampil di lonceng header. Belum ada kolomnya di `profiles`,
// jadi disimpan di `user_metadata.notifications` (seperti Preferensi dan nama panggilan) dan dibaca dari token sesi —
// membuka halaman mana pun tidak menambah query. Kabar yang belum pernah diatur dianggap menyala.

import { getSessionUser } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { NOTIFICATION_TOPICS, type NotificationRole, type NotificationSettings, type NotificationTopic } from '@/lib/notification-topics'

export { NOTIFICATION_TOPICS, type NotificationRole, type NotificationSettings, type NotificationTopic }

const ALL_TOPICS: NotificationTopic[] = [...NOTIFICATION_TOPICS.pembeli, ...NOTIFICATION_TOPICS.nelayan]

function fromMetadata(value: unknown): NotificationSettings {
    const saved = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>
    return Object.fromEntries(ALL_TOPICS.map((topic) => [topic, saved[topic] !== false])) as NotificationSettings
}

/** Pengaturan user yang login, dari token sesi. Semua menyala kalau belum pernah disimpan. */
export async function getNotificationSettings(): Promise<NotificationSettings> {
    const user = await getSessionUser()
    return fromMetadata(user?.metadata.notifications)
}

/** Simpan pengaturan satu peran; kabar peran lain yang sudah tersimpan tidak ikut berubah. */
export async function saveNotificationSettings(role: NotificationRole, values: Partial<NotificationSettings>): Promise<void> {
    const current = await getNotificationSettings()
    const next = { ...current }
    for (const topic of NOTIFICATION_TOPICS[role]) next[topic] = values[topic] === true

    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({ data: { notifications: next } })
    if (error) throw new Error(`Gagal simpan pengaturan notifikasi: ${error.message}`)

    // updateUser tidak menerbitkan token baru, dan pengaturan ini dibaca dari token: tanpa refresh, lonceng tetap
    // memakai pengaturan lama sampai token berikutnya diterbitkan.
    const { error: refreshError } = await supabase.auth.refreshSession()
    if (refreshError) throw new Error(`Gagal memperbarui sesi: ${refreshError.message}`)
}
