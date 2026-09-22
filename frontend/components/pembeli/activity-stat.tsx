import { Icon, type IconName } from '@/components/ui/icon'

export type ActivityStatContent = {
  icon: IconName
  label: string
  value: string
  // Change versus the previous period, e.g. "+3", with its caption ("dari kemarin").
  delta: string
  caption: string
}

export function ActivityStat({ icon, label, value, delta, caption }: ActivityStatContent) {
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[14px] p-[14px_16px] justify-start items-center bg-[#F7F9FC] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[14px]">
      <div className="box-border w-[44px] shrink-0 h-[44px] flex flex-row gap-0 justify-center items-center bg-[#FFFFFF] rounded-[999px]">
        <Icon name={icon} fill="#0F6CB8" className="box-border w-[20px] shrink-0 h-[20px]" />
      </div>
      <dl className="box-border [flex:1_1_0] min-w-0 lg:min-w-auto h-fit flex flex-col gap-[2px] justify-start items-start">
        <dt className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-medium text-left [white-space:nowrap]">{label}</dt>
        <dd className="text-[22px]/[normal] sm:text-[26px]/[normal] box-border text-[#0B3B5C] font-poppins font-bold text-left [white-space:nowrap]">{value}</dd>
      </dl>
      <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-[6px] justify-start items-end">
        <span className="box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[2px_8px] justify-start items-start bg-[#E8F8F2] rounded-[999px]">
          <span className="text-[12px]/[normal] box-border text-[#17704A] font-poppins font-semibold text-left [white-space:nowrap]">{delta}</span>
        </span>
        <span className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{caption}</span>
      </div>
    </div>
  )
}
