import Image from 'next/image'
import { Icon, type IconName } from '@/components/ui/icon'
import { ACCENTS, type Accent } from '@/components/home/accents'
import type { ImageContent } from '@/components/home/hero'
import { CARD_LIFT } from '@/components/ui/interaction'

export type BenefitPoint = {
  icon: IconName
  title: string
  description: string
}

export type Benefit = {
  icon: IconName
  accent: Accent
  title: string
  subtitle: string
  image: ImageContent
  points: BenefitPoint[]
}

export function BenefitCard({ icon, accent, title, subtitle, image, points }: Benefit) {
  const colors = ACCENTS[accent]

  return (
    <div data-reveal className={`box-border [flex:1_1_0] h-[320px] [box-shadow:0px_0px_0px_1px_#0000000F,_0px_1px_2px_-1px_#0000000F,_0px_2px_4px_0px_#0000000A] bg-[#FFFFFF] rounded-[24px] overflow-hidden relative ${CARD_LIFT}`}>
      <div className="box-border w-[307px] h-[322px] absolute left-[282px] top-[-1px] [z-index:0]">
        <Image src={image.src} alt={image.alt} fill sizes="307px" className="object-cover object-center" />
      </div>
      <div className="box-border w-[321px] h-[322px] absolute left-[268px] top-[-1px] [background-image:linear-gradient(90deg,_#FFFFFFFF_0%,_#FFFFFFFF_22%,_#FFFFFF00_62%,_#FFFFFF00_100%)] bg-no-repeat bg-[length:100%_100%] [z-index:1]" />
      <div className="box-border w-[320px] h-fit absolute left-[32px] top-[32px] flex flex-col gap-[28px] justify-start items-start [z-index:2]">
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-center">
          <div
            className={`box-border w-[56px] shrink-0 h-[56px] flex flex-row gap-0 justify-center items-center ${colors.solid} rounded-[999px]`}
          >
            <Icon name={icon} fill="#FFFFFF" className="box-border w-[28px] shrink-0 h-[28px]" />
          </div>
          <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] justify-start items-start">
            <h3 className="text-[24px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">
              {title}
            </h3>
            <p className="text-[15px]/[normal] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">
              {subtitle}
            </p>
          </div>
        </div>
        <ul className="box-border w-full h-fit shrink-0 flex flex-col gap-[20px] justify-start items-start">
          {points.map((point) => (
            <li
              key={point.title}
              className="box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-start"
            >
              <div
                className={`box-border w-[44px] shrink-0 h-[44px] flex flex-row gap-0 justify-center items-center ${colors.soft} rounded-[999px]`}
              >
                <Icon name={point.icon} fill={colors.fill} className="box-border w-[22px] shrink-0 h-[22px]" />
              </div>
              <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] justify-start items-start">
                <p className="text-[15px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">
                  {point.title}
                </p>
                <p className="text-[14px]/[21px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">
                  {point.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
