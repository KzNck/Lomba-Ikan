import { Fragment } from 'react'
import { Icon } from '@/components/ui/icon'
import { SectionHeader } from '@/components/home/section-header'
import { StepCard, type Step } from '@/components/home/step-card'

type HowItWorksProps = {
  id: string
  eyebrow: string
  title: string
  subtitle: string
  steps: Step[]
}

export function HowItWorks({ id, eyebrow, title, subtitle, steps }: HowItWorksProps) {
  return (
    <section
      id={id}
      className="box-border w-full h-fit shrink-0 scroll-mt-[80px] flex flex-col gap-[28px] sm:gap-[32px] lg:gap-[40px] pt-[48px] pb-[56px] lg:pt-[56px] lg:pb-[72px] px-frame justify-start items-start bg-[#F7F9FC]"
    >
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        subtitleClassName="text-[16px]/[26px] sm:text-[17px]/[27px] w-full max-w-[620px] lg:w-[620px]"
      />
      {/* One column on phones, two on tablets; from lg the row of five with arrows between. */}
      <div className="box-border w-full h-fit lg:h-[256px] shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-[16px] lg:flex lg:flex-row lg:gap-[10px] justify-start items-stretch lg:items-center">
        {steps.map((step, index) => (
          <Fragment key={step.icon}>
            {index > 0 && (
              <span data-reveal className="hidden lg:flex box-border w-[20px] shrink-0 h-[20px]">
                <Icon name="arrow-right" fill="#94A3B8" className="box-border w-[20px] shrink-0 h-[20px]" />
              </span>
            )}
            <StepCard number={index + 1} {...step} />
          </Fragment>
        ))}
      </div>
    </section>
  )
}
