import { useTranslations } from 'next-intl'
import { MainDecoration } from '@/components/nelayan/main-decoration'

// Placeholder bar and block shapes, pulsing only when motion is allowed.
const BAR = 'box-border shrink-0 bg-[#E2E8F0] rounded-[6px]'
// The white card; each use adds its own width, gap and padding (kept out of here so none of them conflict).
const SURFACE =
  'box-border h-fit flex flex-col justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[20px]'
const PANEL = `${SURFACE} w-full shrink-0 gap-[14px] p-[24px]`

// Rows in the Riwayat table skeleton, and field rows in the Akun one.
const TABLE_ROWS = 6
const FORM_ROWS = 4

// What the main column shows between a click and the server's answer, beside the sidebar that stays in place: the
// header bar (which carries the page title in both roles), then the page's own shape. `dashboard` (the default) is two panels in the dashboard's
// proportions, also right for the pages that draw the dashboard behind a modal; `table` is Riwayat's filters and
// history table; `account` is Akun's section menu beside its form. Close-enough shapes beat a blank column.
export function MainSkeleton({ role, shape = 'dashboard' }: { role: 'nelayan' | 'pembeli'; shape?: 'dashboard' | 'table' | 'account' }) {
  const t = useTranslations('dashboard')
  const body = {
    dashboard: (
      <>
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[20px] justify-start items-start">
          <div className={`${SURFACE} [flex:2_1_0] gap-[14px] p-[24px]`}>
            <div className={`${BAR} w-[160px] h-[18px]`} />
            <div className="box-border w-full h-[160px] shrink-0 bg-[#F7F9FC] rounded-[14px]" />
          </div>
          <div className={`${SURFACE} [flex:1_1_0] gap-[14px] p-[24px]`}>
            <div className={`${BAR} w-[120px] h-[18px]`} />
            <div className="box-border w-full h-[160px] shrink-0 bg-[#F7F9FC] rounded-[14px]" />
          </div>
        </div>
        <div className={PANEL}>
          <div className={`${BAR} w-[200px] h-[18px]`} />
          <div className="box-border w-full h-[120px] shrink-0 bg-[#F7F9FC] rounded-[14px]" />
        </div>
      </>
    ),
    // The date and status controls (label over a 46px box), then the table: a header row and its rows.
    table: (
      <>
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[14px] justify-start items-end">
          {['w-[280px]', 'w-[190px]'].map((width) => (
            <div key={width} className={`box-border ${width} shrink-0 flex flex-col gap-[6px]`}>
              <div className={`${BAR} w-[90px] h-[12px]`} />
              <div className="box-border w-full h-[46px] shrink-0 bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[12px]" />
            </div>
          ))}
        </div>
        <div className={`${SURFACE} w-full shrink-0 gap-0 overflow-hidden`}>
          <div className="box-border w-full h-[48px] shrink-0 bg-[#F7F9FC]" />
          {Array.from({ length: TABLE_ROWS }, (_, index) => (
            <div
              key={index}
              className="box-border w-full h-[64px] shrink-0 flex flex-row gap-[24px] p-[0px_20px] items-center [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0]"
            >
              <div className={`${BAR} w-[96px] h-[14px]`} />
              <div className={`${BAR} [flex:1_1_0] h-[14px]`} />
              <div className={`${BAR} w-[80px] h-[14px]`} />
              <div className={`${BAR} w-[110px] h-[14px]`} />
              <div className={`${BAR} w-[84px] h-[24px] rounded-[999px]`} />
            </div>
          ))}
        </div>
      </>
    ),
    // The 240px section menu, then the form card: its heading and rows of paired fields.
    account: (
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[20px] justify-start items-start">
        <div className={`${SURFACE} w-[240px] shrink-0 gap-[4px] p-[12px]`}>
          {['w-[120px]', 'w-[100px]', 'w-[80px]'].map((width) => (
            <div key={width} className="box-border w-full h-[48px] shrink-0 flex flex-row gap-[12px] p-[0px_14px] items-center">
              <div className={`${BAR} w-[20px] h-[20px] rounded-[999px]`} />
              <div className={`${BAR} ${width} h-[14px]`} />
            </div>
          ))}
        </div>
        <div className={`${SURFACE} [flex:1_1_0] min-w-0 gap-[24px] p-[28px]`}>
          <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[8px]">
            <div className={`${BAR} w-[140px] h-[18px]`} />
            <div className={`${BAR} w-[280px] h-[14px]`} />
          </div>
          {Array.from({ length: FORM_ROWS }, (_, index) => (
            <div key={index} className="box-border w-full h-fit shrink-0 flex flex-row gap-[20px]">
              {[0, 1].map((column) => (
                <div key={column} className="box-border [flex:1_1_0] flex flex-col gap-[8px]">
                  <div className={`${BAR} w-[100px] h-[12px]`} />
                  <div className="box-border w-full h-[50px] shrink-0 bg-[#F7F9FC] rounded-[12px]" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
  }[shape]
  const content = (
    <div role="status" className="box-border w-full h-fit shrink-0 flex flex-col gap-[20px] justify-start items-start motion-safe:animate-pulse">
      <span className="sr-only">{t('loading')}</span>
      {body}
    </div>
  )

  // Both roles: the 81px header bar across the top, then the padded content; the nelayan pages add their waves.
  return (
    <div className="box-border [flex:1_1_0] flex flex-col gap-0 justify-start items-start relative">
      <div
        aria-hidden="true"
        className="box-border w-full h-[81px] shrink-0 bg-[#FFFFFF] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0] relative [z-index:0]"
      />
      {role === 'nelayan' && <MainDecoration />}
      <div
        className={`box-border w-full [flex:1_1_0] flex flex-col gap-0 justify-start items-start ${role === 'nelayan' ? 'p-[20px_32px_120px_32px] relative [z-index:2]' : 'p-[32px]'}`}
      >
        {content}
      </div>
    </div>
  )
}
