/**
 * Supabase Edge Function: trigger-freshness
 *
 * Dipanggil via Database Webhook setelah row baru/update
 * di tabel catches dengan status = 'LISTED'
 *
 * Setup di Supabase Dashboard:
 * Database > Webhooks > Create webhook
 *   Table: catches
 *   Events: INSERT, UPDATE
 *   URL: https://<project>.supabase.co/functions/v1/trigger-freshness
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CLOUD_RUN_URL = Deno.env.get("CLOUD_RUN_URL")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface CatchRow {
  id: string;
  species: string;
  weight_kg: number;
  catch_time: string;
  storage_method: string;
  vessel_name: string;
  status: string;
  freshness_grade: string | null;
}

Deno.serve(async (req) => {
  const payload = await req.json();
  const row: CatchRow = payload.record;

  // Hanya proses kalau status LISTED dan belum ada grade
  if (row.status !== "LISTED" || row.freshness_grade !== null) {
    return new Response("skipped", { status: 200 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Hit Cloud Run predict endpoint
  const aiResponse = await fetch(`${CLOUD_RUN_URL}/api/v1/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      catch_id: row.id,
      species: row.species,
      weight_kg: row.weight_kg,
      catch_time: row.catch_time,
      storage_method: row.storage_method,
      vessel_condition: "baik", // bisa ditambah field nanti
    }),
  });

  if (!aiResponse.ok) {
    console.error("AI endpoint error:", await aiResponse.text());
    return new Response("ai_error", { status: 500 });
  }

  const result = await aiResponse.json();

  // Update catches dengan hasil AI
  const { error: updateError } = await supabase
    .from("catches")
    .update({
      freshness_grade: result.grade,
      freshness_score: result.score,
      freshness_notes: result.notes,
    })
    .eq("id", row.id);

  if (updateError) {
    console.error("Supabase update error:", updateError);
    return new Response("db_error", { status: 500 });
  }

  // Tulis ke ai_inference_log
  await supabase.from("ai_inference_log").insert({
    catch_id: row.id,
    model_version: result.model_version,
    input_payload: {
      species: row.species,
      weight_kg: row.weight_kg,
      catch_time: row.catch_time,
      storage_method: row.storage_method,
    },
    output_payload: result,
    grade_result: result.grade,
    score_result: result.score,
    latency_ms: null,
    status: "success",
  });

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
});