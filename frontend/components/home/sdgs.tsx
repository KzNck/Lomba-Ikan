import { SectionHeader } from '@/components/home/section-header'
import { SdgCard, type Sdg } from '@/components/home/sdg-card'

type SdgsProps = {
  id: string
  eyebrow: string
  title: string
  subtitle: string
  goals: Sdg[]
}

export function Sdgs({ id, eyebrow, title, subtitle, goals }: SdgsProps) {
  return (
    <section
      id={id}
      className="box-border w-full h-fit shrink-0 scroll-mt-[80px] flex flex-col gap-[28px] lg:gap-[32px] pt-[48px] pb-[64px] lg:pt-[64px] lg:pb-[88px] px-frame justify-start items-start bg-[#FFFFFF]"
    >
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        subtitleClassName="text-[16px]/[26px] sm:text-[17px]/[27px] lg:text-[17px]/[normal] lg:[white-space:nowrap]"
      />
      {/* One column on phones, two on tablets; from lg the row of five. */}
      <div className="box-border w-full h-fit lg:h-[339px] shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-[16px] lg:flex lg:flex-row lg:gap-[20px] justify-start items-stretch lg:items-start">
        {goals.map((goal) => (
          <SdgCard key={goal.number} {...goal} />
        ))}
      </div>
    </section>
  )
}
