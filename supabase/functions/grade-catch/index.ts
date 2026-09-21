/**
 * Edge Function: grade-catch
 *
 * Dipanggil dari lib/freshness/grade.ts -> gradeCatch(), tepat setelah foto
 * tangkapan tersimpan (submitCatch) dan dari tombol "Nilai ulang" (regradeCatch).
 *
 * Alur: cek pemanggil = nelayan pemilik tangkapan -> ambil foto dari
 * catches.photo_url -> panggil Freshness API (multipart, input model yang
 * tersimpan di row) -> simpan grade ke catches -> catat di ai_inference_log.
 *
 * URL Freshness API disimpan sebagai secret Supabase, bukan env Vercel:
 *   supabase secrets set FRESHNESS_API_URL=https://lombaikan-production.up.railway.app
 *   supabase functions deploy grade-catch
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const FRESHNESS_API_URL = Deno.env.get('FRESHNESS_API_URL')

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  try {
    const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
    if (!token) return json({ message: 'Unauthorized' }, 401)

    // Service role for the reads and writes; the caller's token is only used to know who they are.
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    const {
      data: { user },
      error: authError,
    } = await admin.auth.getUser(token)
    if (authError || !user) return json({ message: 'Unauthorized' }, 401)

    if (!FRESHNESS_API_URL) {
      console.error('grade-catch: secret FRESHNESS_API_URL belum diset')
      return json({ message: 'FRESHNESS_API_URL belum diset' }, 500)
    }

    const { catch_id } = await req.json()
    const { data: item } = await admin.from('catches').select('*').eq('id', catch_id).maybeSingle()
    // Service role melewati RLS: hanya nelayan pemilik tangkapan yang boleh menilainya.
    if (!item || item.nelayan_id !== user.id) return json({ message: 'Tangkapan tidak ditemukan' }, 404)
    if (!item.photo_url) return json({ message: 'Foto tangkapan belum tersimpan' }, 400)

    const photo = await fetch(item.photo_url)
    if (!photo.ok) return json({ message: 'Foto tidak bisa diambil' }, 502)

    // Jam sejak jaring ditarik, dihitung dari catch_time: sama dengan yang dipakai wizard saat mencatat.
    const hoursPostHaul = Math.max(1, Math.round((Date.now() - Date.parse(item.catch_time)) / 3_600_000))
    const inputs = {
      status_ikan: item.status_ikan ?? 'MATI',
      hours_post_haul: hoursPostHaul,
      ice_to_fish_ratio: Number(item.ice_to_fish_ratio ?? 0),
      ambient_temp_celsius: Number(item.ambient_temp_celsius ?? 30),
      storage_method: item.storage_method,
      fish_category: item.fish_category ?? 'rucah',
    }

    const form = new FormData()
    form.set('catch_id', item.id)
    for (const [key, value] of Object.entries(inputs)) form.set(key, String(value))
    form.set('photo', await photo.blob(), 'catch.jpg')

    const started = Date.now()
    const response = await fetch(`${FRESHNESS_API_URL}/api/v1/predict`, { method: 'POST', body: form })
    const latency = Date.now() - started

    if (!response.ok) {
      const message = await response.text()
      console.error('grade-catch: Freshness API error', response.status, message)
      await admin.from('ai_inference_log').insert({
        catch_id: item.id,
        model_version: 'unknown',
        input_payload: { ...inputs, photo_url: item.photo_url },
        latency_ms: latency,
        status: 'error',
        error_message: `${response.status}: ${message}`.slice(0, 500),
      })
      return json({ message: 'Freshness API gagal menilai foto' }, 502)
    }

    const result = await response.json()
    const score = Math.round(result.confidence_score * 100)

    const { error: updateError } = await admin
      .from('catches')
      .update({
        freshness_grade: result.predicted_grade,
        freshness_score: score,
        freshness_notes: result.rationale,
        hilirisasi_recommendation: result.hilirisasi_recommendation,
        ai_override_applied: result.override_applied,
      })
      .eq('id', item.id)
    if (updateError) {
      console.error('grade-catch: gagal simpan grade', updateError)
      return json({ message: 'Gagal simpan hasil kesegaran' }, 500)
    }

    await admin.from('ai_inference_log').insert({
      catch_id: item.id,
      model_version: result.model_version,
      input_payload: { ...inputs, photo_url: item.photo_url },
      output_payload: result,
      grade_result: result.predicted_grade,
      score_result: score,
      latency_ms: latency,
      status: 'success',
    })

    return json({ grade: result.predicted_grade, score })
  } catch (error) {
    console.error('grade-catch error:', error)
    return json({ message: 'Internal error' }, 500)
  }
})
