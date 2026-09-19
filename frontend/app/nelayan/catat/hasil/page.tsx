import { NelayanDashboard } from '@/components/nelayan/dashboard'
import { FreshnessModal } from '@/components/nelayan/freshness-modal'
import { publishListing } from '@/app/nelayan/actions'
import { CATCH_BREADCRUMB } from '@/components/nelayan/catch-content'
import { FRESHNESS_MODAL, FRESHNESS_RESULT, GRADE_PANEL, PRICE_FIELD, USAGE_RECOMMENDATIONS } from '@/components/nelayan/freshness-content'

// The "07 Hasil Kesegaran" frame: the graded result over the dashboard, after the wizard's photo step.
export default function HasilKesegaranPage() {
  return (
    <>
      <NelayanDashboard breadcrumb={CATCH_BREADCRUMB} />
      <FreshnessModal
        modal={FRESHNESS_MODAL}
        result={FRESHNESS_RESULT}
        gradePanel={GRADE_PANEL}
        recommendations={USAGE_RECOMMENDATIONS}
        price={PRICE_FIELD}
        action={publishListing}
      />
    </>
  )
}
