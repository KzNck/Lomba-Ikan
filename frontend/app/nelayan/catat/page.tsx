import { getTranslations } from 'next-intl/server'
import { NelayanDashboard } from '@/components/nelayan/dashboard'
import { loadNelayanDashboard } from '@/lib/nelayan/dashboard'
import { CatchWizard } from '@/components/nelayan/catch-wizard'
import { catchBreadcrumb } from '@/components/nelayan/catch-content'

// The "07 Tambah Tangkapan" frames: the dashboard stays in place behind the modal's scrim while the wizard steps.
export default async function TambahTangkapanPage() {
  const breadcrumb = catchBreadcrumb(await getTranslations('dashboard.nelayan.catch'))
  return (
    <>
      <NelayanDashboard data={await loadNelayanDashboard()} breadcrumb={breadcrumb} />
      <CatchWizard />
    </>
  )
}
