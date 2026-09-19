// A placeholder card for the "Memuat listing" state.
export function ListingSkeletonCard() {
  return (
    <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[16px] overflow-hidden motion-safe:animate-pulse">
      <div className="box-border w-full h-[100px] shrink-0 bg-[#E2E8F0]" />
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] p-[14px] justify-start items-start">
        <div className="box-border w-[120px] h-[12px] shrink-0 bg-[#E2E8F0] rounded-[6px]" />
        <div className="box-border w-[160px] h-[12px] shrink-0 bg-[#E2E8F0] rounded-[6px]" />
        <div className="box-border w-[90px] h-[12px] shrink-0 bg-[#E2E8F0] rounded-[6px]" />
        <div className="box-border w-full h-[40px] shrink-0 bg-[#F7F9FC] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[8px]" />
      </div>
    </div>
  )
}
