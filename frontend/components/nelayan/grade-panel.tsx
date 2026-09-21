import { Icon, type IconName } from '@/components/ui/icon'
import { GradeRing } from '@/components/nelayan/grade-ring'

export type FreshnessResult = {
  // "A1" … "B3"; the letter picks the ring's tone. "–" while the AI hasn't graded the catch.
  grade: string
  condition: string
  // 0–100; fills the ring and is shown as "Estimasi kesegaran".
  freshness: number
  temperature: string
}

type GradePanelProps = {
  result: FreshnessResult
  gradeLabel: string
  summaryTitle: string
  metricLabels: { freshness: string; temperature: string }
}

// The left half of the result: the grade ring over a wave, then the "Ringkasan Hasil" figures.
export function GradePanel({ result, gradeLabel, summaryTitle, metricLabels }: GradePanelProps) {
  return (
    <div className="box-border w-[430px] shrink-0 h-full flex flex-col gap-[24px] p-[28px_24px_24px_24px] justify-between items-start [background-image:linear-gradient(180deg,_#F3FAFF_0%,_#E5F3FF_100%)] bg-no-repeat bg-[length:100%_100%] rounded-[20px] overflow-hidden relative">
      <div aria-hidden="true" className="box-border w-[430px] absolute left-0 top-[150px] bottom-0 [z-index:0]">
        <svg
          viewBox="0 0 430 140"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="box-border w-[430px] h-[140px] absolute left-0 top-0 overflow-visible [z-index:0]"
        >
          <path d="M0 70 C70 40 140 40 215 62 C290 84 360 78 430 50 L430 140 L0 140 Z" fill="#65C7F51F" />
        </svg>
        <svg
          viewBox="0 0 430 140"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="box-border w-[430px] h-[140px] absolute left-0 top-0 overflow-visible [z-index:1]"
        >
          <path d="M0 100 C80 78 150 80 225 96 C300 112 370 104 430 88 L430 140 L0 140 Z" fill="#65C7F52E" />
        </svg>
        {/* Carries the two waves' combined tint down from their flat bottom edge and fades it out, so a tall panel
            doesn't end the waves in a hard line. */}
        <div className="box-border w-full absolute left-0 top-[140px] bottom-0 [background-image:linear-gradient(180deg,_#65C7F547_0%,_#65C7F500_100%)]" />
      </div>
      <GradeRing grade={result.grade} gradeLabel={gradeLabel} condition={result.condition} freshness={result.freshness} />
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[14px] p-[18px] justify-start items-start bg-[#FFFFFFB3] rounded-[16px] relative [z-index:2]">
        <h3 className="text-[15px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">{summaryTitle}</h3>
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-start items-start">
          <Metric icon="shield-check" label={metricLabels.freshness} value={`${result.freshness}%`} />
          <Metric icon="thermometer" label={metricLabels.temperature} value={result.temperature} divider />
        </div>
      </div>
    </div>
  )
}

function Metric({ icon, label, value, divider }: { icon: IconName; label: string; value: string; divider?: boolean }) {
  return (
    <div
      className={`box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] justify-start items-start ${divider ? 'p-[0px_0px_0px_16px] [border-width:0px_0px_0px_1px] [border-style:solid] [border-color:#E2E8F0]' : ''}`}
    >
      <Icon name={icon} fill="#0F6CB8" className="box-border w-[20px] h-[20px] shrink-0" />
      <p className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{label}</p>
      <p className="text-[16px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">{value}</p>
    </div>
  )
}
