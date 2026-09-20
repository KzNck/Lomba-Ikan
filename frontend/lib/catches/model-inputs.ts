// lib/catches/model-inputs.ts
//
// Terjemahan jawaban wizard "Tambah Tangkapan" ke kosakata yang dipakai model AI
// dan database (lihat CHECK constraint di supabase/schema.sql).
//
// Terpisah dari lib/freshness/client.ts supaya wizard — yang berjalan di browser
// dan juga memakai ini untuk antrean offline — tidak ikut menarik modul yang
// membaca FRESHNESS_API_URL.

import type { FishCategory, StatusIkan, StorageMethod } from '@/types/database'

/** Input model yang diturunkan dari jawaban wizard, siap disimpan dan dikirim. */
export type ModelInputs = {
    status_ikan: StatusIkan
    ice_to_fish_ratio: number
    ambient_temp_celsius: number
    storage_method: StorageMethod
    fish_category: FishCategory
    hours_post_haul: number
}

/** Kondisi es dari wizard → storage_method yang dikenal model dan database. */
const STORAGE_METHOD: Record<string, StorageMethod> = {
    banyak: 'crushed_ice',
    sedikit: 'chilled_seawater',
    tanpa: 'ambient',
}

/** Perkiraan rasio es terhadap ikan per pilihan di wizard. */
const ICE_RATIO: Record<string, number> = {
    banyak: 1,
    sedikit: 0.5,
    tanpa: 0,
}

/** Kategori wizard → tiga kategori hilirisasi yang dipakai model. */
const FISH_CATEGORY: Record<string, FishCategory> = {
    campuran: 'campuran',
    teri: 'teri_non_grade',
}

/**
 * Suhu sekitar belum ditanyakan di wizard. Dipakai angka wajar untuk dek kapal
 * di perairan Indonesia; ganti kalau nanti ada sensornya.
 */
const ASSUMED_AMBIENT_TEMP = 30

/** Jam sejak jaring ditarik, dari pilihan waktu di wizard. */
export function hoursPostHaul(time: string, now: Date = new Date()): number {
    const hour = now.getHours()
    switch (time) {
        case 'pagi':
            return Math.max(1, hour - 6)
        case 'siang':
            return Math.max(1, hour - 12)
        case 'sore':
            return Math.max(1, hour - 16)
        case 'kemarin-malam':
            return hour + 8
        default:
            return 6
    }
}

/** Waktu tangkap sebagai timestamp, untuk kolom `catch_time`. */
export function catchTimestamp(time: string, now: Date = new Date()): string {
    return new Date(now.getTime() - hoursPostHaul(time, now) * 60 * 60 * 1000).toISOString()
}

/** Terjemahkan jawaban wizard ke input model. */
export function toModelInputs(input: { category: string; time: string; ice: string }): ModelInputs {
    return {
        // Wizard tidak menanyakan hidup/mati. By-catch yang sudah ditarik dan
        // diberi es praktis selalu mati, jadi itu yang dipakai sampai ada
        // pertanyaannya di form.
        status_ikan: 'MATI',
        ice_to_fish_ratio: ICE_RATIO[input.ice] ?? 0,
        ambient_temp_celsius: ASSUMED_AMBIENT_TEMP,
        storage_method: STORAGE_METHOD[input.ice] ?? 'ambient',
        fish_category: FISH_CATEGORY[input.category] ?? 'rucah',
        hours_post_haul: hoursPostHaul(input.time),
    }
}
