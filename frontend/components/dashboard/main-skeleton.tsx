import { useTranslations } from 'next-intl'
import { MainDecoration } from '@/components/nelayan/main-decoration'

// Placeholder bar and block shapes, pulsing only when motion is allowed.
const BAR = 'box-border shrink-0 bg-[#E2E8F0] rounded-[6px]'
const PANEL =
  'box-border w-full h-fit shrink-0 flex flex-col gap-[14px] p-[24px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px]'

// What the main column shows between a click and the server's answer, beside the sidebar that stays in place: the
// header, a title and two content panels in the dashboard's proportions. Generic on purpose — the pages it stands in
// for (dashboard, riwayat, akun, marketplace) differ, and a close-enough shape beats a blank column.
export function MainSkeleton({ role }: { role: 'nelayan' | 'pembeli' }) {
  const t = useTranslations('dashboard')
  const content = (
    <div role="status" className="box-border w-full h-fit shrink-0 flex flex-col gap-[20px] justify-start items-start motion-safe:animate-pulse">
      <span className="sr-only">{t('loading')}</span>
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] justify-start items-start">
        <div className={`${BAR} w-[180px] h-[28px]`} />
        <div className={`${BAR} w-[320px] h-[14px]`} />
      </div>
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[20px] justify-start items-start">
        <div className={`${PANEL} [flex:2_1_0]`}>
          <div className={`${BAR} w-[160px] h-[18px]`} />
          <div className="box-border w-full h-[160px] shrink-0 bg-[#F7F9FC] rounded-[14px]" />
        </div>
        <div className={`${PANEL} [flex:1_1_0]`}>
          <div className={`${BAR} w-[120px] h-[18px]`} />
          <div className="box-border w-full h-[160px] shrink-0 bg-[#F7F9FC] rounded-[14px]" />
        </div>
      </div>
      <div className={PANEL}>
        <div className={`${BAR} w-[200px] h-[18px]`} />
        <div className="box-border w-full h-[120px] shrink-0 bg-[#F7F9FC] rounded-[14px]" />
      </div>
    </div>
  )

  if (role === 'pembeli') {
    // The pembeli pages pad the whole column and open with a top bar row.
    return (
      <div className="box-border [flex:1_1_0] flex flex-col gap-[28px] p-[32px] justify-start items-start">
        <div aria-hidden="true" className="box-border w-full h-[52px] shrink-0 flex flex-row justify-between items-center motion-safe:animate-pulse">
          <div className={`${BAR} w-[260px] h-[24px]`} />
          <div className={`${BAR} w-[240px] h-[48px] rounded-[999px]`} />
        </div>
        {content}
      </div>
    )
  }

  // The nelayan pages: the 81px header bar across the top, the waves, then the padded content.
  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
      <div
        aria-hidden="true"
        className="box-border w-full h-[81px] shrink-0 bg-[#FFFFFF] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0] relative [z-index:0]"
      />
      <MainDecoration />
      <div className="box-border w-full [flex:1_1_0] flex flex-col gap-0 p-[20px_32px_32px_32px] justify-start items-start relative [z-index:2]">
        {content}
      </div>
    </div>
  )
}
