import { Icon, type IconName } from '@/components/ui/icon'

export type SummaryStatContent = {
  icon: IconName
  value: string
  unit?: string
  label: string
  note: string
  // Stats with a trend show an up arrow before the note; the rest wrap the note at 170px.
  trend?: 'up'
}

export function SummaryStat({ icon, value, unit, label, note, trend }: SummaryStatContent) {
  return (
    <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-[10px] justify-start items-start">
      <div className="box-border w-[44px] h-[44px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#FFFFFF] rounded-[999px]">
        <Icon name={icon} fill="#168BE5" className="box-border w-[22px] shrink-0 h-[22px]" />
      </div>
      <p className="box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-end">
        <span className="text-[32px]/[35px] box-border text-[#FFFFFF] font-poppins font-bold text-left [white-space:nowrap]">{value}</span>
        {unit && (
          <span className="text-[18px]/[25px] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">{unit}</span>
        )}
      </p>
      <div className="box-border w-fit h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start">
        <p className="text-[14px]/[normal] box-border text-[#FFFFFF] font-inter font-semibold text-left [white-space:nowrap]">{label}</p>
        <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-[4px] justify-start items-center">
          {trend === 'up' ? (
            <>
              <Icon name="arrow-up" fill="#E3F0F9" className="box-border w-[13px] shrink-0 h-[13px]" />
              <p className="text-[12px]/[normal] box-border text-[#E3F0F9] font-inter font-normal text-left [white-space:nowrap]">{note}</p>
            </>
          ) : (
            <p className="text-[12px]/[17px] box-border w-[170px] shrink-0 text-[#FFFFFF] font-inter font-normal text-left">{note}</p>
          )}
        </div>
      </div>
    </div>
  )
}
