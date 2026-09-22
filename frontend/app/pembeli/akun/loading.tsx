import { MainSkeleton } from '@/components/dashboard/main-skeleton'

// Akun's section menu beside its form, while the profile loads. Also covers Akun › Preferensi.
export default function PembeliAkunLoading() {
  return <MainSkeleton role="pembeli" shape="account" />
}
