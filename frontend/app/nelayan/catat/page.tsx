import { NelayanDashboard } from '@/components/nelayan/dashboard'
import { loadNelayanDashboard } from '@/lib/nelayan/dashboard'
import { CatchWizard } from '@/components/nelayan/catch-wizard'
import {
  CATCH_BREADCRUMB,
  CATCH_MODAL,
  CATEGORY_STEP,
  VOLUME_STEP,
  TIME_STEP,
  CONDITION_STEP,
  ICE_STEP,
  PHOTO_STEP,
} from '@/components/nelayan/catch-content'

// The "07 Tambah Tangkapan" frames: the dashboard stays in place behind the modal's scrim while the wizard steps.
export default async function TambahTangkapanPage() {
  return (
    <>
      <NelayanDashboard data={await loadNelayanDashboard()} breadcrumb={CATCH_BREADCRUMB} />
      <CatchWizard
        modal={CATCH_MODAL}
        category={CATEGORY_STEP}
        volume={VOLUME_STEP}
        time={TIME_STEP}
        condition={CONDITION_STEP}
        ice={ICE_STEP}
        photo={PHOTO_STEP}
      />
    </>
  )
}
