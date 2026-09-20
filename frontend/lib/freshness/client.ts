// lib/freshness/client.ts
//
// Panggilan ke Freshness AI API (FastAPI di Cloud Run, lihat ../freshness-api).
//
// Endpoint-nya multipart/form-data — foto ikut dikirim — bukan JSON. Catatan:
// Edge Function `trigger-freshness` di supabase/functions/ masih memakai bentuk
// JSON yang lama dan membaca field `grade`/`score`/`notes` yang tidak pernah
// dikembalikan endpoint ini; alur di app memakai modul ini, bukan webhook itu.

import type { FreshnessGrade } from '@/types/database'

const API_URL = process.env.FRESHNESS_API_URL

/** Bentuk response /api/v1/predict, sesuai FreshnessResult di app/models/schemas.py. */
type PredictResponse = {
    catch_id: string
    predicted_grade: 'A1' | 'A2' | 'A3' | 'B1' | 'B2' | 'B3'
    confidence_score: number
    hilirisasi_recommendation: string
    override_applied: boolean
    rationale: string
    model_version: string
}

export type FreshnessOutcome = {
    // Huruf depan saja — enum freshness_grade di database hanya A/B/C.
    grade: FreshnessGrade
    // Sub-grade lengkap (A1…B3) untuk ditampilkan; belum ada kolomnya di database.
    subgrade: PredictResponse['predicted_grade']
    score: number
    recommendation: string
    rationale: string
}

/** Kondisi es dari wizard → storage_method yang dikenal model. */
const STORAGE_METHOD: Record<string, string> = {
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

/** Kategori wizard → tiga kategori yang dipakai model. */
const FISH_CATEGORY: Record<string, string> = {
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

/**
 * Minta penilaian kesegaran. Mengembalikan null kalau FRESHNESS_API_URL belum
 * diset atau API-nya gagal — tangkapan tetap tersimpan, hanya belum bergrade,
 * dan UI menampilkannya sebagai "Belum dinilai".
 */
export async function predictFreshness(input: {
    catchId: string
    category: string
    time: string
    ice: string
    photo: Blob
}): Promise<FreshnessOutcome | null> {
    if (!API_URL) return null

    const form = new FormData()
    form.set('catch_id', input.catchId)
    // Wizard tidak menanyakan hidup/mati. By-catch yang sudah ditarik dan diberi
    // es praktis selalu mati, jadi itu yang dikirim sampai ada pertanyaannya.
    form.set('status_ikan', 'MATI')
    form.set('hours_post_haul', String(hoursPostHaul(input.time)))
    form.set('ice_to_fish_ratio', String(ICE_RATIO[input.ice] ?? 0))
    form.set('ambient_temp_celsius', String(ASSUMED_AMBIENT_TEMP))
    form.set('storage_method', STORAGE_METHOD[input.ice] ?? 'ambient')
    form.set('fish_category', FISH_CATEGORY[input.category] ?? 'rucah')
    form.set('photo', input.photo, 'catch.jpg')

    try {
        const response = await fetch(`${API_URL}/api/v1/predict`, { method: 'POST', body: form })
        if (!response.ok) {
            console.error('Freshness API error:', response.status, await response.text())
            return null
        }

        const result = (await response.json()) as PredictResponse
        return {
            grade: result.predicted_grade[0] as FreshnessGrade,
            subgrade: result.predicted_grade,
            // Model mengembalikan 0–1; UI menampilkannya sebagai persen.
            score: Math.round(result.confidence_score * 100),
            recommendation: result.hilirisasi_recommendation,
            rationale: result.rationale,
        }
    } catch (error) {
        console.error('Freshness API unreachable:', error)
        return null
    }
}

/**
 * Sub-grade untuk ditampilkan. Kolom `freshness_subgrade` belum ada di schema,
 * jadi untuk row yang sudah tersimpan angkanya diturunkan dari skor: makin
 * tinggi skor makin kecil angkanya (A1 lebih baik dari A3).
 */
export function displaySubgrade(grade: FreshnessGrade | null, score: number | null): string | null {
    if (!grade || score === null) return null
    const step = score >= 85 ? 1 : score >= 70 ? 2 : 3
    return `${grade}${step}`
}
