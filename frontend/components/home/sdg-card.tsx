import Image from 'next/image'
import { CARD_LIFT } from '@/components/ui/interaction'

export type Sdg = {
  number: number
  // Official UN goal icon (public domain, via Wikimedia Commons), e.g. '/images/sdgs/goal-14.svg'
  badge: string
  title: string
  target: string
  description: string
}

export function SdgCard({ number, badge, title, target, description }: Sdg) {
  return (
    <div data-reveal className={`box-border [flex:1_1_0] h-auto lg:h-full [box-shadow:0px_0px_0px_1px_#0000000F,_0px_1px_2px_-1px_#0000000F,_0px_2px_4px_0px_#0000000A] flex flex-col gap-[14px] p-[24px] justify-start items-start bg-[#FFFFFF] rounded-[20px] ${CARD_LIFT}`}>
      <Image
        src={badge}
        alt={`SDG ${number}`}
        width={72}
        height={72}
        className="box-border w-[72px] h-[72px] shrink-0"
      />
      <h3 className="text-[16px]/[22px] box-border w-full text-[#0B3B5C] font-poppins font-semibold text-left">
        {title}
      </h3>
      <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-0 justify-start items-start">
        <span className="text-[13px]/[normal] box-border text-[#0F6CB8] font-inter font-semibold text-left [white-space:nowrap]">
          {target}
        </span>
      </div>
      <p className="text-[14px]/[22px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">
        {description}
      </p>
    </div>
  )
}
