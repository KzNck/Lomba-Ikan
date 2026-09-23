import { Icon, type IconName } from '@/components/ui/icon'
import { GradeRing } from '@/components/nelayan/grade-ring'
import { RegradeButton } from '@/components/nelayan/regrade-button'
import type { UngradedContent } from '@/components/nelayan/freshness-content'

export type FreshnessResult = {
  // "A1" … "B3"; the letter picks the ring's tone. "–" while the AI hasn't graded the catch.
  grade: string
  condition: string
  // 0–100 from the grade (A1 full … B3 low); fills the ring.
  level: number
  // The model's confidence in the grade, "37%"; shown as "Keyakinan hasil".
  confidence: string
  temperature: string
}

// Set when the catch has no grade: the panel explains that instead of showing an empty ring and "0%".
export type UngradedState = {
  catchId: string
  copy: UngradedContent
  // "Nilai ulang", when the photo was kept and can be sent again.
  regrade?: (formData: FormData) => void | Promise<void>
  // A "Nilai ulang" just failed as well.
  stillFailing: boolean
}

type GradePanelProps = {
  result: FreshnessResult
  ungraded?: UngradedState
  gradeLabel: string
  summaryTitle: string
  metricLabels: { confidence: string; temperature: string }
}

// The left half of the result: the grade ring over a wave, then the "Ringkasan Hasil" figures.
export function GradePanel({ result, ungraded, gradeLabel, summaryTitle, metricLabels }: GradePanelProps) {
  return (
    <div className="box-border w-full lg:w-[430px] shrink-0 h-auto lg:h-full flex flex-col gap-[24px] lg:gap-[16px] p-[20px_16px_16px_16px] sm:p-[28px_24px_24px_24px] lg:p-[24px_24px_20px_24px] justify-between items-start [background-image:linear-gradient(180deg,_#F3FAFF_0%,_#E5F3FF_100%)] bg-no-repeat bg-[length:100%_100%] rounded-[20px] overflow-hidden relative">
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
      {ungraded ? (
        <UngradedNotice {...ungraded} />
      ) : (
        <>
          <GradeRing grade={result.grade} gradeLabel={gradeLabel} condition={result.condition} level={result.level} />
          <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[14px] p-[18px] justify-start items-start bg-[#FFFFFFB3] rounded-[16px] relative [z-index:2]">
            <h3 className="text-[15px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">{summaryTitle}</h3>
            <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-start items-start">
              <Metric icon="sparkles" label={metricLabels.confidence} value={result.confidence} />
              <Metric icon="thermometer" label={metricLabels.temperature} value={result.temperature} divider />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Metric({ icon, label, value, divider }: { icon: IconName; label: string; value: string; divider?: boolean }) {
  return (
    <div
      className={`box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] justify-start items-start ${divider ? 'p-[0px_0px_0px_16px] [border-width:0px_0px_0px_1px] [border-style:solid] [border-color:#E2E8F0]' : ''}`}
    >
      <Icon name={icon} fill="#0F6CB8" className="box-border w-[20px] h-[20px] shrink-0" />
      <p className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left sm:[white-space:nowrap]">{label}</p>
      <p className="text-[16px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">{value}</p>
    </div>
  )
}

// The panel's content when the catch has no grade: what happened, and "Nilai ulang" when the photo can be resent.
// The panel keeps its size (the modal's columns don't jump), with the notice centred in it.
function UngradedNotice({ catchId, copy, regrade, stillFailing }: UngradedState) {
  return (
    <div className="box-border w-full h-[420px] shrink-0 flex flex-col gap-[16px] p-[0px_12px] justify-center items-center relative [z-index:2]">
      <div className="box-border w-[64px] h-[64px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#FFF4E0] rounded-[999px]">
        <Icon name="circle-alert" fill="#B26A00" className="box-border w-[28px] shrink-0 h-[28px]" />
      </div>
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-center">
        <h3 className="text-[20px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-center">{copy.title}</h3>
        <p className="text-[14px]/[21px] box-border max-w-[320px] text-[#5B6B7C] font-inter font-normal text-center">
          {regrade ? copy.body : copy.noPhotoBody}
        </p>
      </div>
      {regrade && <RegradeButton catchId={catchId} label={copy.retryLabel} pendingLabel={copy.retryingLabel} action={regrade} />}
      {/* role="status" so the outcome of the retry is announced when the page comes back. */}
      <p role="status" className="text-[13px]/[18px] box-border max-w-[320px] text-[#B26A00] font-inter font-medium text-center empty:hidden">
        {stillFailing ? copy.stillFailing : ''}
      </p>
    </div>
  )
}
