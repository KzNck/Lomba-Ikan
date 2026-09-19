import { Icon, type IconName } from '@/components/ui/icon'

type DetailRowProps = {
  icon: IconName
  label: string
  children: React.ReactNode
  // A "Lihat peta" link, or a chevron when omitted.
  trailing?: React.ReactNode
}

// One outlined row in the "Detail Listing" drawer: icon badge, small label, then the value (text or thumbnails).
export function DetailRow({ icon, label, children, trailing }: DetailRowProps) {
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[12px_14px] justify-start items-center [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[12px]">
      <div className="box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#F3FAFF] rounded-[999px]">
        <Icon name={icon} fill="#0F6CB8" className="box-border w-[18px] shrink-0 h-[18px]" />
      </div>
      <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start">
        <p className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{label}</p>
        {children}
      </div>
      {trailing ?? <Icon name="chevron-right" fill="#5B6B7C" className="box-border w-[18px] shrink-0 h-[18px]" />}
    </div>
  )
}

export function DetailValue({ children }: { children: React.ReactNode }) {
  return <p className="text-[14px]/[normal] box-border w-full text-[#0B3B5C] font-poppins font-semibold text-left">{children}</p>
}
