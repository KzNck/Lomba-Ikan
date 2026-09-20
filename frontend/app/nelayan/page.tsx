import { NelayanDashboard } from '@/components/nelayan/dashboard'
import { loadNelayanDashboard } from '@/lib/nelayan/dashboard'

export default async function NelayanDashboardPage() {
  return <NelayanDashboard data={await loadNelayanDashboard()} />
}
