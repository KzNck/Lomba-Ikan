import { Icon } from '@/components/ui/icon'

// Grade A reads as good (green); grade B uses the neutral tint from the "Grade B (tint netral)" state.
const GRADE_TONES = {
  A: {
    track: '#E8F8F2',
    progress: '#2FAE6E',
    icon: '#1D8055',
    badge: 'bg-[#17704A]',
    grade: 'text-[#17704A]',
    pill: '[outline:2px_solid_#E8F8F2]',
    pillIcon: 'circle-check',
    pillText: 'text-[#17704A]',
  },
  B: {
    track: '#E2E8F0',
    progress: '#5B6B7C',
    icon: '#5B6B7C',
    badge: 'bg-[#5B6B7C]',
    grade: 'text-[#0B3B5C]',
    pill: '[outline:2px_solid_#E2E8F0]',
    pillIcon: 'circle-alert',
    pillText: 'text-[#0B3B5C]',
  },
} as const

type GradeRingProps = {
  grade: string
  gradeLabel: string
  condition: string
  // 0–100; how much of the ring is filled.
  freshness: number
}

// The export cuts the ring out with a clip-path traced for 92%. It's an SVG stroke here with the same geometry
// (236px ring, 16.52px band, starting at 12 o'clock and running clockwise) so any percentage draws correctly.
export function GradeRing({ grade, gradeLabel, condition, freshness }: GradeRingProps) {
  const tone = GRADE_TONES[grade[0] as keyof typeof GRADE_TONES]

  return (
    <div className="box-border w-full h-[260px] shrink-0 relative [z-index:1]">
      <svg
        viewBox="0 0 236 236"
        aria-hidden="true"
        className="box-border w-[236px] h-[236px] absolute left-[73px] top-0 -rotate-90 [z-index:0]"
      >
        <circle cx="118" cy="118" r="109.74" fill="none" stroke={tone.track} strokeWidth="16.52" />
        <circle
          cx="118"
          cy="118"
          r="109.74"
          fill="none"
          stroke={tone.progress}
          strokeWidth="16.52"
          pathLength="100"
          strokeDasharray={`${freshness} 100`}
        />
      </svg>
      <div className="box-border w-[192px] h-[192px] [box-shadow:0px_6px_20px_0px_#0F5C821A] absolute left-[95px] top-[22px] flex flex-col gap-[2px] justify-center items-center bg-[#FFFFFF] rounded-[999px] [z-index:2]">
        <Icon name="fish" fill={tone.icon} className="box-border w-[30px] h-[30px] shrink-0" />
        <span className={`box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[3px_12px] justify-start items-start ${tone.badge} rounded-[999px]`}>
          <span className="text-[13px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">{gradeLabel}</span>
        </span>
        <span className={`text-[56px]/[59px] box-border ${tone.grade} font-poppins font-bold text-left [white-space:nowrap]`}>{grade}</span>
      </div>
      <div className="box-border w-[382px] h-fit absolute left-0 top-[210px] flex flex-row gap-0 justify-center items-start [z-index:3]">
        <span className={`box-border w-fit shrink-0 h-fit [box-shadow:0px_4px_14px_0px_#0F5C821A] flex flex-row gap-[8px] p-[10px_18px] justify-start items-center bg-[#FFFFFF] ${tone.pill} [outline-offset:-1px] rounded-[999px]`}>
          <Icon name={tone.pillIcon} fill={tone.icon} className="box-border w-[18px] shrink-0 h-[18px]" />
          <span className={`text-[15px]/[normal] box-border ${tone.pillText} font-poppins font-semibold text-left [white-space:nowrap]`}>{condition}</span>
        </span>
      </div>
    </div>
  )
}
