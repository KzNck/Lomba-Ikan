import Image from 'next/image'
import Link from 'next/link'
import { Icon, type IconName } from '@/components/ui/icon'
import type { ImageContent } from '@/components/home/hero'

export type RoleOption = {
  href: string
  icon: IconName
  title: string
  description: string
  image: ImageContent
}

// States from the "Role Card States" frame. Hover draws its 2px border as an inset ring so the content doesn't shift.
const CARD_STATES =
  '[box-shadow:0px_0px_0px_1px_#0000000F,_0px_1px_2px_-1px_#0000000F,_0px_2px_4px_0px_#0000000A] hover:[box-shadow:inset_0px_0px_0px_2px_#168BE5,_0px_8px_24px_0px_#168BE52E] focus-visible:[box-shadow:none] focus-visible:[outline:3px_solid_#0F6CB8]'

export function RoleOptionCard({ href, icon, title, description, image }: RoleOption) {
  return (
    <Link
      href={href}
      className={`box-border w-[420px] shrink-0 h-full ${CARD_STATES} flex flex-col gap-[20px] short:gap-[14px] p-[24px_32px_28px_32px] short:p-[20px_28px] justify-start items-start bg-[#FFFFFF] rounded-[24px] transition-[translate,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-1 motion-safe:active:translate-y-0 motion-safe:active:duration-100`}
    >
      {/* Short windows shrink the picture, not the text: 220×120 keeps the illustration's shape uncropped. */}
      <div className="box-border w-full h-[190px] short:w-[220px] short:h-[120px] short:self-center shrink-0 rounded-[16px] overflow-hidden relative">
        <Image src={image.src} alt={image.alt} fill sizes="356px" className="object-cover object-center" />
      </div>
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[20px] justify-start items-start">
        <div className="box-border w-[64px] shrink-0 h-[64px] flex flex-row gap-0 justify-center items-center bg-[#DCEEFB] rounded-[999px]">
          <Icon name={icon} fill="#0F6CB8" className="box-border w-[30px] shrink-0 h-[30px]" />
        </div>
        <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[8px] p-[6px_0px_0px_0px] justify-start items-start">
          <h2 className="text-[24px]/[normal] box-border text-[#0B3B5C] font-poppins font-bold text-left [white-space:nowrap]">
            {title}
          </h2>
          <p className="text-[15px]/[24px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">
            {description}
          </p>
        </div>
      </div>
      <div className="box-border w-full [flex:1_1_0] flex flex-row gap-0 justify-end items-end">
        <Icon name="arrow-right" fill="#0F6CB8" className="box-border w-[22px] shrink-0 h-[22px]" />
      </div>
    </Link>
  )
}
