import { Icon, type IconName } from '@/components/ui/icon'

export type NotificationContent = {
  tone: keyof typeof TONE_STYLES
  icon: IconName
  message: string
  time: string
}

const TONE_STYLES = {
  success: { circle: 'bg-[#E8F8F2]', fill: '#17704A' },
  info: { circle: 'bg-[#DCEEFB]', fill: '#0F6CB8' },
  warning: { circle: 'bg-[#FFF4E0]', fill: '#8A5100' },
}

// The export gives each row a fixed content-box size (w-[280px], h-[108.5px]/[88.5px]) that already includes the
// padding; rows here fill the card and size to their text, with a hairline under all but the last.
export function NotificationItem({ tone, icon, message, time, divider }: NotificationContent & { divider: boolean }) {
  const toneStyle = TONE_STYLES[tone]
  const border = divider
    ? '[border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0] [margin:0px_0px_-0.5px_0px]'
    : ''

  return (
    <li className={`box-border w-full h-fit shrink-0 flex flex-row gap-[14px] p-[14px_0px] justify-start items-start ${border}`}>
      <div className={`box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center ${toneStyle.circle} rounded-[999px]`}>
        <Icon name={icon} fill={toneStyle.fill} className="box-border w-[20px] shrink-0 h-[20px]" />
      </div>
      <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[6px] justify-start items-start">
        <p className="text-[13px]/[20px] box-border w-full text-[#0B3B5C] font-inter font-normal text-left">{message}</p>
        <p className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{time}</p>
      </div>
    </li>
  )
}
