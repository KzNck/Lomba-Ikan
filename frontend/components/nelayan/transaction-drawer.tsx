import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { PRESS } from '@/components/ui/interaction'
import { TRANSACTION_DRAWER, TRANSACTION_STATES } from '@/components/nelayan/riwayat-content'
import { gradeCondition } from '@/lib/catches/present'
import type { TransactionDetailContent } from '@/lib/nelayan/riwayat'

type TransactionDrawerProps = {
  detail: TransactionDetailContent
  closeHref: string
}

const TITLE_ID = 'transaction-drawer-title'

// "Detail Transaksi Drawer": a 400px panel docked to the right of the table, below the header. Like the listing
// drawer it is not modal — the table stays readable — so the open row keeps its blue marker as the visible link
// between the two. The export fixes it at 400×1126px inside the 1440×1220 frame.
export function TransactionDrawer({ detail, closeHref }: TransactionDrawerProps) {
  const state = TRANSACTION_STATES[detail.state]
  const banner = TRANSACTION_DRAWER.banner[detail.state](detail.bannerAt)

  return (
    <aside
      aria-labelledby={TITLE_ID}
      className="box-border w-[400px] [box-shadow:-12px_0px_32px_0px_#0B3B5C14] absolute right-0 top-0 bottom-0 flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] [border-width:0px_0px_0px_1px] [border-style:solid] [border-color:#E2E8F0] overflow-clip [z-index:3] motion-safe:animate-fade-in"
    >
      <header className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[18px_20px] justify-between items-center [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0]">
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center">
          <span className="box-border w-[34px] shrink-0 h-[34px] flex flex-row gap-0 justify-center items-center bg-[#F3FAFF] rounded-[999px]">
            <Icon name="receipt-text" fill="#0F6CB8" className="box-border w-[18px] shrink-0 h-[18px]" />
          </span>
          <h2 id={TITLE_ID} className="text-[19px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">
            {TRANSACTION_DRAWER.title}
          </h2>
        </div>
        <Link
          href={closeHref}
          scroll={false}
          aria-label={TRANSACTION_DRAWER.closeLabel}
          className={`box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#F7F9FC] hover:bg-[#E3F0F9] rounded-[999px] ${PRESS} ${FOCUS_RING}`}
        >
          <Icon name="x" fill="#0B3B5C" className="box-border w-[18px] shrink-0 h-[18px]" />
        </Link>
      </header>
      <div className="box-border w-full [flex:1_1_0] min-h-0 flex flex-col gap-[14px] p-[20px] justify-start items-start overflow-y-auto overscroll-contain">
        <p className={`box-border w-full h-fit shrink-0 flex flex-row gap-[10px] p-[12px_14px] justify-start items-center ${state.chip} rounded-[12px]`}>
          <Icon name={state.icon} fill={state.fill} className="box-border w-[18px] shrink-0 h-[18px]" />
          <span className={`text-[13px]/[normal] box-border [flex:1_1_0] ${state.text} font-poppins font-semibold text-left`}>{banner}</span>
        </p>

        <Panel title={TRANSACTION_DRAWER.timelineTitle} gap="gap-0">
          <ol className="box-border w-full flex flex-col gap-0 justify-start items-start">
            {detail.steps.map((step, index) => (
              <li key={step.label} className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[6px_0px] justify-start items-start">
                <span className="box-border w-[18px] shrink-0 h-fit flex flex-col gap-0 justify-start items-center">
                  {index === detail.steps.length - 1 ? (
                    <span className={`box-border w-[16px] h-[16px] shrink-0 ${state.dot} [outline-offset:-1.5px] rounded-[999px]`} />
                  ) : (
                    <>
                      <span className="box-border w-[12px] h-[12px] shrink-0 bg-[#94A3B8] rounded-[999px]" />
                      <span className="box-border w-[2px] h-[16px] shrink-0 bg-[#E2E8F0]" />
                    </>
                  )}
                </span>
                <span className="box-border [flex:1_1_0] h-fit flex flex-col gap-[1px] justify-start items-start">
                  <span
                    className={`text-[13px]/[normal] box-border ${index === detail.steps.length - 1 ? 'text-[#0B3B5C] font-semibold' : 'text-[#5B6B7C] font-medium'} font-poppins text-left [white-space:nowrap]`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{step.time}</span>
                </span>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title={TRANSACTION_DRAWER.infoTitle}>
          <Row label={TRANSACTION_DRAWER.infoLabels.id} value={detail.id} />
          <Row label={TRANSACTION_DRAWER.infoLabels.date} value={detail.date} />
          <Row label={TRANSACTION_DRAWER.infoLabels.partner}>
            <span className="box-border [flex:1_1_0] h-fit flex flex-row gap-[8px] justify-start items-center">
              <span className="box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center bg-[#F3FAFF] rounded-[999px]">
                <Icon name={detail.partner.icon} fill="#0F6CB8" className="box-border w-[14px] shrink-0 h-[14px]" />
              </span>
              <span className="box-border [flex:1_1_0] min-w-0 flex flex-col gap-[1px] justify-start items-start">
                <span className="text-[13px]/[17px] box-border w-full text-[#0B3B5C] font-inter font-semibold text-left">{detail.partner.name}</span>
                {detail.partner.type && (
                  <span className="text-[11px]/[normal] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{detail.partner.type}</span>
                )}
              </span>
            </span>
          </Row>
          <Row label={TRANSACTION_DRAWER.infoLabels.grade}>
            <span
              className={`box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] p-[4px_10px] justify-start items-center ${detail.grade && gradeCondition(detail.grade) === 'live' ? 'bg-[#E8F8F2]' : 'bg-[#F7F9FC] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px]'} rounded-[999px]`}
            >
              <Icon
                name={detail.grade && gradeCondition(detail.grade) === 'live' ? 'leaf' : 'snowflake'}
                fill={detail.grade && gradeCondition(detail.grade) === 'live' ? '#17704A' : '#5B6B7C'}
                className="box-border w-[13px] shrink-0 h-[13px]"
              />
              <span
                className={`text-[12px]/[normal] box-border ${detail.grade && gradeCondition(detail.grade) === 'live' ? 'text-[#17704A]' : 'text-[#0B3B5C]'} font-poppins font-semibold text-left [white-space:nowrap]`}
              >
                {detail.gradeLabel}
              </span>
            </span>
          </Row>
        </Panel>

        <Panel title={TRANSACTION_DRAWER.catchTitle}>
          <Row label={TRANSACTION_DRAWER.catchLabels.category} value={detail.category} />
          <Row label={TRANSACTION_DRAWER.catchLabels.volume} value={detail.volume} />
          <Row label={TRANSACTION_DRAWER.catchLabels.hauledAt} value={detail.hauledAt} />
          <Row label={TRANSACTION_DRAWER.catchLabels.ice} value={detail.ice} />
          {detail.photoUrl && (
            <Row label={TRANSACTION_DRAWER.catchLabels.photo}>
              <span className="box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center">
                {/* The photo lives in Supabase storage, so it is a plain <img>: next/image would need that host allowed. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={detail.photoUrl}
                  alt={`Foto tangkapan ${detail.category}`}
                  className="box-border w-[64px] shrink-0 h-[48px] object-cover [border:1px_solid_#0000001A] rounded-[8px]"
                />
                <a
                  href={detail.photoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-[13px]/[normal] box-border text-[#0F6CB8] hover:underline font-poppins font-semibold text-left [white-space:nowrap] rounded-[4px] ${FOCUS_RING}`}
                >
                  {TRANSACTION_DRAWER.photoLink}
                </a>
              </span>
            </Row>
          )}
        </Panel>

        <Panel title={TRANSACTION_DRAWER.paymentTitle}>
          <Row label={TRANSACTION_DRAWER.paymentLabels.pricePerKg} value={detail.pricePerKg} />
          <Row label={TRANSACTION_DRAWER.paymentLabels.total} value={detail.total} strong />
          <Row label={TRANSACTION_DRAWER.paymentLabels.method} value={TRANSACTION_DRAWER.paymentMethod} />
          <Row label={TRANSACTION_DRAWER.paymentLabels.status}>
            <span
              className={`box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] p-[4px_10px] justify-start items-center ${detail.paid ? 'bg-[#E8F8F2]' : 'bg-[#F7F9FC] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px]'} rounded-[999px]`}
            >
              <Icon
                name={detail.paid ? 'circle-check' : 'clock-3'}
                fill={detail.paid ? '#17704A' : '#5B6B7C'}
                className="box-border w-[13px] shrink-0 h-[13px]"
              />
              <span
                className={`text-[12px]/[normal] box-border ${detail.paid ? 'text-[#17704A]' : 'text-[#0B3B5C]'} font-poppins font-semibold text-left [white-space:nowrap]`}
              >
                {detail.paid ? TRANSACTION_DRAWER.paymentPaid : TRANSACTION_DRAWER.paymentPending}
              </span>
            </span>
          </Row>
        </Panel>

        <p className="box-border w-full h-fit shrink-0 flex flex-row gap-[10px] p-[12px_14px] justify-start items-start bg-[#DCEEFB] rounded-[12px]">
          <Icon name="info" fill="#0F6CB8" className="box-border w-[16px] shrink-0 h-[16px]" />
          <span className="text-[12px]/[18px] box-border [flex:1_1_0] text-[#0B3B5C] font-inter font-normal text-left">{TRANSACTION_DRAWER.note[detail.state]}</span>
        </p>
      </div>
    </aside>
  )
}

// One outlined block in the drawer: a title with label/value rows under it.
function Panel({ title, gap = 'gap-[10px]', children }: { title: string; gap?: string; children: React.ReactNode }) {
  return (
    <section
      className={`box-border w-full h-fit shrink-0 flex flex-col ${gap} p-[14px_16px] justify-start items-start [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[12px]`}
    >
      <h3 className="text-[14px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">{title}</h3>
      {children}
    </section>
  )
}

function Row({ label, value, strong, children }: { label: string; value?: string; strong?: boolean; children?: React.ReactNode }) {
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[10px] justify-start items-start">
      <span className="text-[12px]/[17px] box-border w-[120px] shrink-0 text-[#5B6B7C] font-inter font-normal text-left">{label}</span>
      {children ?? (
        <span className={`text-[13px]/[18px] box-border [flex:1_1_0] text-[#0B3B5C] font-inter ${strong ? 'font-bold' : 'font-medium'} text-left`}>
          {value}
        </span>
      )}
    </div>
  )
}
