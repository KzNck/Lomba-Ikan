import { MainSkeleton } from '@/components/dashboard/main-skeleton'

// Shown for every nelayan page while it loads (Listing Saya has its own, closer skeleton).
export default function NelayanLoading() {
  return <MainSkeleton role="nelayan" />
}
