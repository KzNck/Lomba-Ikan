import { Icon } from '@/components/ui/icon'

export type InfoCalloutContent = {
  title: string
  description: string
  href: string
}

export function InfoCallout({ title, description, href }: InfoCalloutContent) {
  return (
    <a
      href={href}
      className="box-border w-full h-fit shrink-0 flex flex-row gap-[14px] p-[16px] justify-start items-center bg-[#F3FAFF] [border:1px_solid_#DCEEFB] rounded-[12px]"
    >
      <Icon name="info" fill="#0F6CB8" className="box-border w-[22px] shrink-0 h-[22px]" />
      <span className="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start">
        <span className="text-[15px]/[normal] box-border text-[#0F6CB8] font-inter font-semibold text-left [white-space:nowrap]">
          {title}
        </span>
        <span className="text-[14px]/[normal] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">
          {description}
        </span>
      </span>
      <Icon name="chevron-right" fill="#0F6CB8" className="box-border w-[20px] shrink-0 h-[20px]" />
    </a>
  )
}
