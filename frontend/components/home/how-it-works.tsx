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
      className="box-border w-full h-fit shrink-0 scroll-mt-[80px] flex flex-col gap-[40px] pt-[56px] pb-[72px] px-frame justify-start items-start bg-[#F7F9FC]"
    >
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        subtitleClassName="text-[17px]/[27px] w-[620px]"
      />
      <div className="box-border w-full h-[256px] shrink-0 flex flex-row gap-[10px] justify-start items-center">
        {steps.map((step, index) => (
          <Fragment key={step.icon}>
            {index > 0 && (
              <span data-reveal className="box-border w-[20px] shrink-0 h-[20px] flex">
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
