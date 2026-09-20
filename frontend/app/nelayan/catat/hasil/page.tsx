import { notFound } from 'next/navigation'
import { NelayanDashboard } from '@/components/nelayan/dashboard'
import { loadNelayanDashboard } from '@/lib/nelayan/dashboard'
import { FreshnessModal } from '@/components/nelayan/freshness-modal'
import { publishListing } from '@/app/nelayan/actions'
import { CATCH_BREADCRUMB } from '@/components/nelayan/catch-content'
import { FRESHNESS_MODAL, GRADE_PANEL, PRICE_FIELD, USAGE_RECOMMENDATIONS } from '@/components/nelayan/freshness-content'
import { getCatchById } from '@/lib/supabase/catches'
import { recommendationsFor } from '@/lib/catches/recommendations'
import { displaySubgrade } from '@/lib/freshness/client'

// Estimated holding temperature per grade — the model reports a grade, not a reading.
const TEMPERATURE = { A: '0–4°C', B: '5–10°C', C: '12–16°C' }

// The "07 Hasil Kesegaran" frame: the graded result over the dashboard, after the wizard's photo step.
export default async function HasilKesegaranPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await searchParams
  if (typeof id !== 'string') notFound()

  const [dashboard, entry] = await Promise.all([loadNelayanDashboard(), getCatchById(id)])
  // RLS hides other fishers' catches, so a miss here is either a bad id or someone else's.
  if (!entry) notFound()

  const score = entry.freshness_score === null ? 0 : Math.round(Number(entry.freshness_score))
  const graded = entry.freshness_grade !== null

  return (
    <>
      <NelayanDashboard data={dashboard} breadcrumb={CATCH_BREADCRUMB} />
      <FreshnessModal
        modal={FRESHNESS_MODAL}
        catchId={entry.id}
        result={{
          grade: displaySubgrade(entry.freshness_grade, entry.freshness_score) ?? '–',
          condition: graded
            ? `${entry.freshness_grade === 'A' ? 'Hidup' : 'Mati'}, ${score}%`
            : 'Belum dinilai',
          freshness: score,
          temperature: graded ? TEMPERATURE[entry.freshness_grade!] : '—',
        }}
        gradePanel={GRADE_PANEL}
        recommendations={{ ...USAGE_RECOMMENDATIONS, options: recommendationsFor(entry) }}
        price={PRICE_FIELD}
        action={publishListing}
      />
    </>
  )
}
