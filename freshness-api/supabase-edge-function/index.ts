/**
 * Supabase Edge Function: trigger-freshness (v2 — model asli)
 *
 * Beda dari v1: endpoint AI sekarang butuh multipart/form-data + file foto
 * (bukan JSON), karena model pakai fusion fitur visual+tabular.
 *
 * Catatan penting: catches.photo_url WAJIB terisi sebelum status jadi LISTED,
 * kalau tidak, fungsi ini akan skip (tidak bisa panggil AI tanpa foto).
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CLOUD_RUN_URL = Deno.env.get("CLOUD_RUN_URL")!; // isinya URL Railway
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface CatchRow {
    id: string;
    species: string;
    weight_kg: number;
    catch_time: string;
    storage_method: string; // harus salah satu: crushed_ice | chilled_seawater | ambient
    vessel_name: string;
    status: string;
    freshness_grade: string | null;
    photo_url: string | null;

    // Field tambahan yang perlu ditambahkan ke schema.sql / form input nelayan
    // kalau belum ada — lihat catatan di bawah README.
    status_ikan?: string;          // 'HIDUP' | 'MATI'
    ice_to_fish_ratio?: number;    // 0.0 - 1.0
    ambient_temp_celsius?: number;
    fish_category?: string;        // 'campuran' | 'teri_non_grade' | 'rucah'
}

Deno.serve(async (req) => {
    const payload = await req.json();
    const row: CatchRow = payload.record;

    if (row.status !== "LISTED" || row.freshness_grade !== null) {
        return new Response("skipped", { status: 200 });
    }

    if (!row.photo_url) {
        console.error("Tidak bisa proses AI: photo_url kosong untuk catch", row.id);
        return new Response("missing_photo", { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 1. Ambil foto dari Supabase Storage
    const photoResponse = await fetch(row.photo_url);
    if (!photoResponse.ok) {
        console.error("Gagal fetch foto dari", row.photo_url);
        return new Response("photo_fetch_error", { status: 500 });
    }
    const photoBlob = await photoResponse.blob();

    // 2. Hitung hours_post_haul dari catch_time
    const catchTime = new Date(row.catch_time);
    const hoursPostHaul = (Date.now() - catchTime.getTime()) / (1000 * 60 * 60);

    // 3. Susun FormData sesuai kontrak endpoint /predict
    const formData = new FormData();
    formData.append("catch_id", row.id);
    formData.append("status_ikan", row.status_ikan ?? "MATI"); // default MATI kalau belum ada field ini
    formData.append("hours_post_haul", hoursPostHaul.toFixed(2));
    formData.append("ice_to_fish_ratio", String(row.ice_to_fish_ratio ?? 0.5));
    formData.append("ambient_temp_celsius", String(row.ambient_temp_celsius ?? 28));
    formData.append("storage_method", row.storage_method);
    formData.append("fish_category", row.fish_category ?? "campuran");
    formData.append("photo", photoBlob, "photo.jpg");

    // 4. Panggil endpoint AI
    const aiResponse = await fetch(`${CLOUD_RUN_URL}/api/v1/predict`, {
        method: "POST",
        body: formData,
    });

    if (!aiResponse.ok) {
        console.error("AI endpoint error:", await aiResponse.text());
        return new Response("ai_error", { status: 500 });
    }

    const result = await aiResponse.json();

    // 5. Update catches dengan hasil AI
    const { error: updateError } = await supabase
        .from("catches")
        .update({
            freshness_grade: result.predicted_grade,
            freshness_score: result.confidence_score * 100,
            freshness_notes: result.rationale,
        })
        .eq("id", row.id);

    if (updateError) {
        console.error("Supabase update error:", updateError);
        return new Response("db_error", { status: 500 });
    }

    // 6. Log ke ai_inference_log
    await supabase.from("ai_inference_log").insert({
        catch_id: row.id,
        model_version: result.model_version,
        input_payload: {
            status_ikan: row.status_ikan,
            hours_post_haul: hoursPostHaul,
            storage_method: row.storage_method,
            photo_url: row.photo_url,
        },
        output_payload: result,
        grade_result: result.predicted_grade,
        score_result: result.confidence_score * 100,
        status: "success",
    });

    return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
    });
});