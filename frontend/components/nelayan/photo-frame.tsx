import { Icon, type IconName } from '@/components/ui/icon'
import { PillButton } from '@/components/nelayan/pill-button'

// The 220px "Preview" box: holds the captured photo, or the live webcam feed while taking one.
export function PhotoFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="box-border w-full h-[220px] shrink-0 flex flex-row gap-0 justify-start items-start [border:1px_solid_#0000001A] rounded-[16px] overflow-hidden relative">
      {children}
    </div>
  )
}

type PhotoMetaProps = {
  icon: IconName
  caption: string
  action: { variant: 'solid' | 'outline'; icon: IconName; label: string; onClick: () => void; disabled?: boolean }
}

// The "Preview Meta" row under the frame: a caption on the left, one action on the right.
export function PhotoMeta({ icon, caption, action }: PhotoMetaProps) {
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
      <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center">
        <Icon name={icon} fill="#5B6B7C" className="box-border w-[18px] shrink-0 h-[18px]" />
        <p className="text-[14px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{caption}</p>
      </div>
      <PillButton {...action} />
    </div>
  )
}
