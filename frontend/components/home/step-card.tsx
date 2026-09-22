import { Icon, type IconName } from '@/components/ui/icon'
import { CARD_LIFT } from '@/components/ui/interaction'

export type Step = {
  icon: IconName
  title: string
  description: string
}

type StepCardProps = Step & {
  number: number
}

export function StepCard({ number, icon, title, description }: StepCardProps) {
  return (
    <div data-reveal className={`box-border [flex:1_1_0] h-auto lg:h-full [box-shadow:0px_0px_0px_1px_#0000000F,_0px_1px_2px_-1px_#0000000F,_0px_2px_4px_0px_#0000000A] flex flex-col gap-[14px] p-[20px_20px_24px_20px] justify-start items-start bg-[#FFFFFF] rounded-[20px] ${CARD_LIFT}`}>
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[0px_0px_6px_0px] justify-between items-start">
        <div className="box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#168BE5] rounded-[999px]">
          <span className="text-[13px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
            {number}
          </span>
        </div>
        <div className="box-border w-[64px] shrink-0 h-[64px] flex flex-row gap-0 justify-center items-center bg-[#DCEEFB] rounded-[999px]">
          <Icon name={icon} fill="#168BE5" className="box-border w-[26px] shrink-0 h-[26px]" />
        </div>
        {/* Mirrors the number badge so the icon stays centered */}
        <div className="box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-start items-start" />
      </div>
      <h3 className="text-[16px]/[normal] box-border w-full text-[#0B3B5C] font-poppins font-semibold text-left">
        {title}
      </h3>
      <p className="text-[14px]/[22px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">
        {description}
      </p>
    </div>
  )
}
