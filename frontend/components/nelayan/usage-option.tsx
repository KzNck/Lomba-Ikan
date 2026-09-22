import { Icon, type IconName } from '@/components/ui/icon'

export type UsageOptionContent = {
  icon: IconName
  title: string
  description: string
}

// One downstream use under "Rekomendasi Penggunaan" (maggot feed, fish silage, liquid fertiliser). Tighter from lg, so the
// result modal fits a laptop window.
export function UsageOption({ icon, title, description }: UsageOptionContent) {
  return (
    <li className="box-border w-full h-fit shrink-0 flex flex-row gap-[14px] lg:gap-[12px] p-[16px] lg:p-[10px_14px] justify-start items-center bg-[#F7F9FC] rounded-[16px] lg:rounded-[14px]">
      <span className="box-border w-[48px] shrink-0 h-[48px] lg:w-[36px] lg:h-[36px] flex flex-row gap-0 justify-center items-center bg-[#DCEEFB] rounded-[999px]">
        <Icon name={icon} fill="#0F6CB8" className="box-border w-[24px] shrink-0 h-[24px] lg:w-[18px] lg:h-[18px]" />
      </span>
      <span className="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] lg:gap-[2px] justify-start items-start">
        <span className="text-[15px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left lg:[white-space:nowrap]">{title}</span>
        <span className="text-[13px]/[19px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{description}</span>
      </span>
    </li>
  )
}
