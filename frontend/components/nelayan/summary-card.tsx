import { Fragment } from 'react'
import Image from 'next/image'
import { Icon } from '@/components/ui/icon'
import { SummaryStat, type SummaryStatContent } from '@/components/nelayan/summary-stat'
import type { ImageContent } from '@/components/home/hero'

type SummaryCardProps = {
  title: string
  image: ImageContent
  stats: SummaryStatContent[]
}

// "Ringkasan Hari Ini". The photo and its fade are anchored to the right edge (the export's left-[638px] in a
// 772px card) so they stay put if the card is wider than the design.
export function SummaryCard({ title, image, stats }: SummaryCardProps) {
  return (
    <section
      className="box-border [flex:1_1_0] h-fit flex flex-col gap-0 justify-start items-start [background-image:linear-gradient(90deg,_#0F6CB8_0%,_#0F5C82_100%)] bg-no-repeat bg-[length:100%_100%] rounded-[20px] overflow-hidden relative motion-safe:animate-fade-up"
      style={{ animationDelay: '160ms' }}
    >
      <div className="box-border w-[134px] h-[259px] absolute right-0 top-0 [z-index:0]">
        <Image src={image.src} alt={image.alt} fill sizes="134px" className="object-cover object-center" />
      </div>
      <div className="box-border w-[90px] h-[259px] absolute right-[44px] top-0 [background-image:linear-gradient(90deg,_#0F5C82_0%,_#0F5C82_20%,_#0F5C8200_100%)] bg-no-repeat bg-[length:100%_100%] [z-index:1]" />
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[22px] p-[28px_32px] justify-start items-start relative [z-index:2]">
        <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center">
          <Icon name="trending-up" fill="#FFFFFF" className="box-border w-[22px] shrink-0 h-[22px]" />
          <h2 className="text-[18px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">{title}</h2>
        </div>
        {/* Top-aligned (the export centres them) so icons, values and labels line up even when a note wraps. */}
        <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-[24px] justify-start items-start">
          {stats.map((stat, index) => (
            <Fragment key={stat.label}>
              {index > 0 && <div className="box-border w-[1px] shrink-0 h-[120px] bg-[#FFFFFF40]" />}
              <SummaryStat {...stat} />
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
