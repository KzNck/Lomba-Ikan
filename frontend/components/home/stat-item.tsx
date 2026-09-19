import { Icon, type IconName } from '@/components/ui/icon'
import { ACCENTS, type Accent } from '@/components/home/accents'
import { CountUp } from '@/components/ui/count-up'

export type Stat = {
  icon: IconName
  accent: Accent
  value: string
  caption: string
}

export function StatItem({ icon, accent, value, caption }: Stat) {
  const colors = ACCENTS[accent]

  return (
    <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[14px] justify-start items-center">
      <div
        className={`box-border w-[52px] shrink-0 h-[52px] flex flex-row gap-0 justify-center items-center ${colors.soft} rounded-[999px]`}
      >
        <Icon name={icon} fill={colors.fill} className="box-border w-[26px] shrink-0 h-[26px]" />
      </div>
      <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start">
        <p className="text-[26px]/[normal] box-border text-[#0B3B5C] font-poppins font-bold text-left [white-space:nowrap]">
          <CountUp value={value} />
        </p>
        <p className="text-[13px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">
          {caption}
        </p>
      </div>
    </div>
  )
}
