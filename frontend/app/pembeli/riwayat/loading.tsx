import { MainSkeleton } from '@/components/dashboard/main-skeleton'

// Riwayat's filters and table, while the history loads.
export default function PembeliRiwayatLoading() {
  return <MainSkeleton role="pembeli" shape="table" />
}
