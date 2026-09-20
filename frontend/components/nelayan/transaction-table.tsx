import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { TABLE, TRANSACTION_STATES } from '@/components/nelayan/riwayat-content'
import type { TransactionRowContent } from '@/lib/nelayan/riwayat'

type TransactionTableProps = {
  rows: TransactionRowContent[]
  // Where a row goes: the same page with its drawer open.
  hrefFor: (id: string) => string
  // The row whose drawer is open, marked with the blue bar down its left edge.
  selectedId?: string
}

// Column widths from the export's header row; the table keeps them so header and cells stay aligned.
const COLUMNS = [
  { key: 'date', width: 'w-[100px]', align: 'text-left' },
  { key: 'partner', width: 'w-[176px]', align: 'text-left' },
  { key: 'grade', width: 'w-[52px]', align: 'text-left' },
  { key: 'weight', width: 'w-[68px]', align: 'text-right' },
  { key: 'total', width: 'w-[108px]', align: 'text-right' },
  { key: 'status', width: 'w-[92px]', align: 'text-left' },
  { key: 'action', width: 'w-[36px]', align: 'text-right' },
] as const

const GRADE_BADGES = {
  A: { badge: 'bg-[#E8F8F2]', text: 'text-[#17704A]' },
  B: { badge: 'bg-[#E2E8F0]', text: 'text-[#0B3B5C]' },
  '—': { badge: 'bg-[#F7F9FC]', text: 'text-[#5B6B7C]' },
}

const CELL = 'box-border p-[13px_0px] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0]'

// "Tabel Transaksi". The export draws it with flex rows; a real table keeps the columns tied to their headers for
// screen readers. Each row's chevron is the link, stretched across the row so anywhere in it opens the drawer.
export function TransactionTable({ rows, hrefFor, selectedId }: TransactionTableProps) {
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[16px] overflow-hidden">
      <table className="box-border w-full table-fixed border-collapse">
        <caption className="sr-only">
          {TABLE.label}. {TABLE.sortedBy}.
        </caption>
        <thead>
          <tr className="box-border h-[46px] bg-[#F7F9FC] [border-width:0px_0px_1px_0px] [border-style:solid] [border-color:#E2E8F0]">
            {COLUMNS.map(({ key, width, align }, index) => (
              <th
                key={key}
                scope="col"
                aria-sort={key === 'date' ? 'descending' : undefined}
                className={`text-[12px]/[normal] box-border ${width} ${align} ${index === 0 ? 'p-[0px_0px_0px_16px]' : index === COLUMNS.length - 1 ? 'p-[0px_16px_0px_0px]' : 'p-[0px_10px_0px_0px]'} text-[#5B6B7C] font-poppins font-semibold [white-space:nowrap]`}
              >
                <span className="box-border inline-flex flex-row gap-[4px] justify-start items-center align-middle">
                  {TABLE.columns[key]}
                  {key === 'date' && <Icon name="arrow-down" fill="#0F6CB8" className="box-border w-[13px] shrink-0 h-[13px]" />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <TransactionRow key={row.id} row={row} href={hrefFor(row.id)} selected={row.id === selectedId} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TransactionRow({ row, href, selected }: { row: TransactionRowContent; href: string; selected: boolean }) {
  const state = TRANSACTION_STATES[row.state]
  const grade = GRADE_BADGES[row.gradeLetter as keyof typeof GRADE_BADGES] ?? GRADE_BADGES['—']

  return (
    <tr className={`box-border relative ${selected ? 'bg-[#F3FAFF]' : 'bg-[#FFFFFF] hover:bg-[#F7F9FC]'} transition-colors duration-150 ease-out`}>
      <td className={`${CELL} p-[13px_10px_13px_16px] align-middle`}>
        {selected && <span aria-hidden="true" className="box-border w-[3px] absolute left-0 top-0 bottom-0 bg-[#0F6CB8]" />}
        <span className="box-border flex flex-col gap-[2px] justify-start items-start">
          <span className="text-[13px]/[normal] box-border text-[#0B3B5C] font-inter font-semibold text-left [white-space:nowrap]">{row.date}</span>
          <span className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{row.time}</span>
        </span>
      </td>
      <td className={`${CELL} p-[13px_10px_13px_0px] align-middle`}>
        <span className="box-border flex flex-row gap-[10px] justify-start items-center">
          <span className="box-border w-[32px] shrink-0 h-[32px] flex flex-row gap-0 justify-center items-center bg-[#F3FAFF] rounded-[999px]">
            <Icon name={row.partner.icon} fill="#0F6CB8" className="box-border w-[16px] shrink-0 h-[16px]" />
          </span>
          <span className="box-border [flex:1_1_0] min-w-0 flex flex-col gap-[1px] justify-start items-start">
            <span className="text-[13px]/[16px] box-border w-full text-[#0B3B5C] font-inter font-semibold text-left">{row.partner.name}</span>
            {row.partner.type && (
              <span className="text-[11px]/[14px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{row.partner.type}</span>
            )}
          </span>
        </span>
      </td>
      <td className={`${CELL} p-[13px_10px_13px_0px] align-middle`}>
        <span className={`box-border w-[30px] h-[30px] flex flex-row gap-0 justify-center items-center ${grade.badge} rounded-[999px]`}>
          <span className={`text-[13px]/[normal] box-border ${grade.text} font-poppins font-bold text-left [white-space:nowrap]`}>{row.gradeLetter}</span>
        </span>
      </td>
      <td className={`text-[13px]/[normal] ${CELL} p-[13px_10px_13px_0px] text-right align-middle text-[#0B3B5C] font-inter font-medium`}>{row.weight}</td>
      <td className={`text-[13px]/[normal] ${CELL} p-[13px_10px_13px_0px] text-right align-middle text-[#0B3B5C] font-poppins font-semibold`}>{row.total}</td>
      <td className={`${CELL} p-[13px_10px_13px_0px] align-middle`}>
        <span className={`box-border w-fit h-fit flex flex-row gap-[5px] p-[4px_9px] justify-start items-center ${state.chip} rounded-[999px]`}>
          <Icon name={state.icon} fill={state.fill} className="box-border w-[13px] shrink-0 h-[13px]" />
          <span className={`text-[12px]/[normal] box-border ${state.text} font-poppins font-semibold text-left [white-space:nowrap]`}>{state.label}</span>
        </span>
      </td>
      <td className={`${CELL} p-[13px_16px_13px_0px] text-right align-middle`}>
        <Link
          href={href}
          scroll={false}
          aria-label={TABLE.detailLabel(row.partner.name)}
          aria-current={selected ? 'true' : undefined}
          className={`box-border inline-flex justify-end items-center rounded-[6px] before:absolute before:inset-0 before:content-[''] ${FOCUS_RING}`}
        >
          <Icon name="chevron-right" fill="#5B6B7C" className="box-border w-[18px] shrink-0 h-[18px]" />
        </Link>
      </td>
    </tr>
  )
}
