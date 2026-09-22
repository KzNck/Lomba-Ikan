import { Fragment } from 'react'
import { Icon } from '@/components/ui/icon'
import { SectionHeader } from '@/components/home/section-header'
import { BenefitCard, type Benefit } from '@/components/home/benefit-card'
import { StatItem, type Stat } from '@/components/home/stat-item'

type ImpactProps = {
  id: string
  eyebrow: string
  title: string
  benefits: Benefit[]
  statsLabelLines: string[]
  stats: Stat[]
}

export function Impact({ id, eyebrow, title, benefits, statsLabelLines, stats }: ImpactProps) {
  return (
    <section
      id={id}
      className="box-border w-full h-fit shrink-0 scroll-mt-[80px] flex flex-col gap-[20px] lg:gap-[24px] pt-[48px] pb-[56px] lg:pt-[64px] lg:pb-[72px] px-frame justify-start items-start [background-image:linear-gradient(90deg,_#E8F8F2_0%,_#DDF4FF_100%)] bg-no-repeat bg-[length:100%_100%]"
    >
      <SectionHeader eyebrow={eyebrow} title={title} className="p-[0px_0px_12px_0px]" />
      <div className="box-border w-full h-fit shrink-0 flex flex-col lg:flex-row gap-[20px] lg:gap-[24px] justify-start items-stretch lg:items-start">
        {benefits.map((benefit) => (
          <BenefitCard key={benefit.icon} {...benefit} />
        ))}
      </div>
      <div data-reveal className="box-border w-full h-fit shrink-0 [box-shadow:0px_0px_0px_1px_#0000000F,_0px_1px_2px_-1px_#0000000F,_0px_2px_4px_0px_#0000000A] flex flex-col lg:flex-row gap-[20px] lg:gap-[24px] p-[20px] sm:p-[24px] lg:p-[24px_32px] justify-between items-start lg:items-center bg-[#FFFFFF] rounded-[20px]">
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[14px] justify-start items-center">
          <Icon name="target" fill="#2FAE6E" className="box-border w-[34px] shrink-0 h-[34px]" />
          <p className="text-[17px]/[22px] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">
            {statsLabelLines.map((line, index) => (
              <Fragment key={index}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        </div>
        {stats.map((stat) => (
          <Fragment key={stat.icon}>
            <div className="box-border w-full lg:w-[1px] shrink-0 h-[1px] lg:h-[48px] bg-[#E2E8F0]" />
            <StatItem {...stat} />
          </Fragment>
        ))}
      </div>
    </section>
  )
}
