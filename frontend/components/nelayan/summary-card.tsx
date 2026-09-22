import Image from 'next/image'
import { Icon } from '@/components/ui/icon'
import { SummaryStat, type SummaryStatContent } from '@/components/nelayan/summary-stat'
import type { ImageContent } from '@/components/home/hero'

type SummaryCardProps = {
  title: string
  image: ImageContent
  stats: SummaryStatContent[]
}

// "Ringkasan Hari Ini": the boat photo fills the card under a bright blue gradient that is solid behind the title
// and stats and thins out to the right, where the boat is. Each stat sits on a frosted tile, so the photo reads
// through without the white text losing its contrast.
export function SummaryCard({ title, image, stats }: SummaryCardProps) {
  return (
    <section
      className="box-border w-full lg:w-auto flex-none lg:[flex:1_1_0] h-fit flex flex-col gap-0 justify-start items-start bg-[#0F6CB8] rounded-[20px] overflow-hidden relative isolate motion-safe:animate-fade-up"
      style={{ animationDelay: '160ms' }}
    >
      <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1440px) 60vw, 800px" className="object-cover object-[75%_60%] [z-index:-2]" />
      <div
        aria-hidden="true"
        className="box-border absolute inset-0 [background-image:linear-gradient(100deg,_#0F6CB8F7_0%,_#0F6CB8E6_40%,_#168BE5A6_64%,_#3BA9F24D_84%,_#65C7F51A_100%)] [z-index:-1]"
      />
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[20px] p-[20px] sm:p-[24px] lg:p-[28px_32px] justify-start items-start">
        <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center">
          <Icon name="trending-up" fill="#FFFFFF" className="box-border w-[22px] shrink-0 h-[22px]" />
          <h2 className="text-[18px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">{title}</h2>
        </div>
        {/* Top-aligned (the export centres them) so icons, values and labels line up even when a note wraps. */}
        {/* Stacked on phones, three across from md, and the design's fitted row from lg. */}
        <div className="box-border w-full lg:w-fit h-fit shrink-0 grid grid-cols-1 md:grid-cols-3 lg:flex lg:flex-row gap-[12px] justify-start items-stretch">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="box-border w-full lg:w-fit h-auto shrink-0 flex flex-col p-[16px_18px] bg-[#0B3B5C59] [border:1px_solid_#FFFFFF33] rounded-[16px] backdrop-blur-md [box-shadow:inset_0px_1px_0px_0px_#FFFFFF26]"
            >
              <SummaryStat {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
