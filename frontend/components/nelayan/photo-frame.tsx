import { Icon, type IconName } from '@/components/ui/icon'
import { PillButton } from '@/components/nelayan/pill-button'

// Height of the photo step's main area (the frame, and the placeholder and "analysing" boxes it replaces): as tall
// as the window leaves room for — the rest of the modal takes about 464px — between 200px and the 369px at which a
// 16:9 frame fills the modal's 656px width.
export const PHOTO_AREA_HEIGHT = 'h-[clamp(200px,calc(100dvh_-_464px),369px)]'

// The "Preview" box: holds the captured photo, or the live webcam feed while taking one. It keeps a webcam's 16:9
// shape — narrower than the modal when the window is short — so the preview shows the whole frame that gets captured
// (use-webcam draws the full video), not a strip cropped out of it.
export function PhotoFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className={`box-border ${PHOTO_AREA_HEIGHT} aspect-video max-w-full shrink-0 self-center flex flex-row gap-0 justify-start items-start bg-[#0B3B5C] [border:1px_solid_#0000001A] rounded-[16px] overflow-hidden relative`}>
      {children}
    </div>
  )
}

type PhotoMetaProps = {
  icon: IconName
  caption: string
  action: { variant: 'solid' | 'outline'; icon: IconName; label: string; onClick: () => void; disabled?: boolean }
}

// The "Preview Meta" row — a caption on the left, one action on the right — laid over the bottom of the frame on a
// dark fade, like a camera app, instead of under it: the rows it frees go to the frame. Render it inside PhotoFrame.
export function PhotoMeta({ icon, caption, action }: PhotoMetaProps) {
  return (
    <div className="box-border w-full h-fit absolute left-0 bottom-0 flex flex-row gap-[12px] p-[28px_14px_12px_16px] justify-between items-center [background-image:linear-gradient(180deg,_#0B3B5C00_0%,_#0B3B5CCC_55%,_#0B3B5CE6_100%)] [z-index:1]">
      <div className="box-border min-w-0 h-fit flex flex-row gap-[8px] justify-start items-center">
        <Icon name={icon} fill="#FFFFFF" className="box-border w-[18px] shrink-0 h-[18px]" />
        <p className="text-[14px]/[normal] box-border text-[#FFFFFF] font-inter font-medium text-left truncate" title={caption}>{caption}</p>
      </div>
      <PillButton {...action} />
    </div>
  )
}
