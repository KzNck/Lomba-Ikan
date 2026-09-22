import { PHOTO_AREA_HEIGHT } from '@/components/nelayan/photo-frame'
import { Icon, type IconName } from '@/components/ui/icon'
import { PillButton } from '@/components/nelayan/pill-button'

const TONES = {
  // "Belum ada foto".
  default: {
    area: 'bg-[#F3FAFF] [outline:1.5px_solid_#C5DDF0] [outline-offset:-0.75px]',
    circle: 'bg-[#DCEEFB]',
    fill: '#0F6CB8',
  },
  // "Webcam tidak bisa diakses".
  error: {
    area: 'bg-[#FFFFFF] [outline:2px_solid_#C23B35] [outline-offset:-1px]',
    circle: 'bg-[#FDECEC]',
    fill: '#C23B35',
  },
}

type PhotoPlaceholderProps = {
  tone: keyof typeof TONES
  icon: IconName
  title: string
  description: string
  action: { icon: IconName; label: string; onClick: () => void; disabled?: boolean }
}

// The 220px "Photo Area" shown while there is no photo or live camera: icon, message and one action.
// The error tone is announced when it appears.
export function PhotoPlaceholder({ tone, icon, title, description, action }: PhotoPlaceholderProps) {
  const style = TONES[tone]
  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className={`box-border w-full ${PHOTO_AREA_HEIGHT} shrink-0 flex flex-col gap-[10px] p-[24px] justify-center items-center ${style.area} rounded-[16px]`}
    >
      <div className={`box-border w-[56px] h-[56px] shrink-0 flex flex-row gap-0 justify-center items-center ${style.circle} rounded-[999px]`}>
        <Icon name={icon} fill={style.fill} className="box-border w-[26px] shrink-0 h-[26px]" />
      </div>
      <p className="text-[16px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">{title}</p>
      <p className="text-[14px]/[21px] box-border w-full md:w-[420px] text-[#5B6B7C] font-inter font-normal text-center">{description}</p>
      <PillButton variant="solid" {...action} />
    </div>
  )
}
