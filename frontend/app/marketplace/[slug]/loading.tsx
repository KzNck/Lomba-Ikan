import { MainSkeleton } from '@/components/dashboard/main-skeleton'

// A batch's drawer over the marketplace: the drawer's outline arrives first, on the same scrim and edge as
// BatchDrawer (480px, full height, from the right), over the pembeli page skeleton.
export default function BatchDetailLoading() {
  return (
    <>
      <MainSkeleton role="pembeli" />
      <div aria-hidden="true" className="fixed inset-0 bg-[#0B3B5CA6] [z-index:40] motion-safe:animate-fade-in">
        <div className="box-border w-[480px] h-dvh ms-auto flex flex-col gap-[16px] p-[24px] bg-[#FFFFFF] [box-shadow:-24px_0px_48px_0px_#0B3B5C40] motion-safe:animate-pulse">
          <div className="box-border w-[220px] h-[24px] shrink-0 bg-[#E2E8F0] rounded-[6px]" />
          <div className="box-border w-[140px] h-[14px] shrink-0 bg-[#E2E8F0] rounded-[6px]" />
          <div className="box-border w-full h-[220px] shrink-0 bg-[#F7F9FC] rounded-[16px]" />
          <div className="box-border w-full h-[88px] shrink-0 bg-[#F7F9FC] rounded-[16px]" />
          <div className="box-border w-full h-[160px] shrink-0 bg-[#F7F9FC] rounded-[16px]" />
        </div>
      </div>
    </>
  )
}
