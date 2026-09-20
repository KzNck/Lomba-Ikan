// lib/freshness/client.ts
//
// Panggilan ke Freshness AI API (FastAPI, lihat ../freshness-api).
//
// Endpoint-nya multipart/form-data — foto ikut dikirim — bukan JSON.
//
// Jawaban wizard diterjemahkan ke input model di lib/catches/model-inputs.ts,
// dan hasil terjemahannya ikut disimpan ke row `catches` (status_ikan,
// ice_to_fish_ratio, ambient_temp_celsius, fish_category) supaya penilaian bisa
// diulang dengan input yang sama persis.

import type { ModelInputs } from '@/lib/catches/model-inputs'
import type { FreshnessGrade } from '@/types/database'

const API_URL = process.env.FRESHNESS_API_URL

/** Bentuk response /api/v1/predict, sesuai FreshnessResult di app/models/schemas.py. */
type PredictResponse = {
    catch_id: string
    predicted_grade: FreshnessGrade
    confidence_score: number
    hilirisasi_recommendation: string
    override_applied: boolean
    rationale: string
    model_version: string
}

export type FreshnessOutcome = {
    grade: FreshnessGrade
    // Model mengembalikan 0–1; disimpan sebagai persen agar cocok dengan NUMERIC(5,2).
    score: number
    recommendation: string
    rationale: string
    overrideApplied: boolean
}


/**
 * Minta penilaian kesegaran. Mengembalikan null kalau FRESHNESS_API_URL belum
 * diset atau API-nya gagal — tangkapan tetap tersimpan, hanya belum bergrade,
 * dan UI menampilkannya sebagai "Belum dinilai".
 */
export async function predictFreshness(input: {
    catchId: string
    inputs: ModelInputs
    photo: Blob
}): Promise<FreshnessOutcome | null> {
    if (!API_URL) return null

    const { hours_post_haul, ...rest } = input.inputs
    const form = new FormData()
    form.set('catch_id', input.catchId)
    form.set('hours_post_haul', String(hours_post_haul))
    for (const [key, value] of Object.entries(rest)) form.set(key, String(value))
    form.set('photo', input.photo, 'catch.jpg')

    try {
        const response = await fetch(`${API_URL}/api/v1/predict`, { method: 'POST', body: form })
        if (!response.ok) {
            console.error('Freshness API error:', response.status, await response.text())
            return null
        }

        const result = (await response.json()) as PredictResponse
        return {
            grade: result.predicted_grade,
            score: Math.round(result.confidence_score * 100),
            recommendation: result.hilirisasi_recommendation,
            rationale: result.rationale,
            overrideApplied: result.override_applied,
        }
    } catch (error) {
        console.error('Freshness API unreachable:', error)
        return null
    }
}
