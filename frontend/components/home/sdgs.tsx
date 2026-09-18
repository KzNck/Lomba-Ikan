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
      className="box-border w-full h-fit shrink-0 scroll-mt-[80px] flex flex-col gap-[32px] pt-[64px] pb-[88px] px-frame justify-start items-start bg-[#FFFFFF]"
    >
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        subtitleClassName="text-[17px]/[normal] [white-space:nowrap]"
      />
      <div className="box-border w-full h-[339px] shrink-0 flex flex-row gap-[20px] justify-start items-start">
        {goals.map((goal) => (
          <SdgCard key={goal.number} {...goal} />
        ))}
      </div>
    </section>
  )
}
