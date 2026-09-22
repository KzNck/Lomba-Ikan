import { NelayanDashboard } from '@/components/nelayan/dashboard'
import { loadNelayanDashboard } from '@/lib/nelayan/dashboard'
import { CatchWizard } from '@/components/nelayan/catch-wizard'

// The "07 Tambah Tangkapan" frames: the dashboard stays in place behind the modal's scrim while the wizard steps.
export default async function TambahTangkapanPage() {
  return (
    <>
      <NelayanDashboard data={await loadNelayanDashboard()} />
      <CatchWizard />
    </>
  )
}
