import { Icon } from '@/components/ui/icon'
import { RupiahInput } from '@/components/nelayan/rupiah-input'

type PriceFieldProps = {
  name: string
  label: string
  helper: string
  prefix: string
  suffix: string
  defaultValue: string
  marketLabel: string
  marketRange: string
  // Shown under the input in red, which also turns the border red (the edit listing form's validation).
  error?: string
  // `stacked` puts the market range under the input, for narrow columns such as the listing drawer.
  layout?: 'inline' | 'stacked'
}

// "Harga Jual": a rupiah-per-kg input with the market range beside it. The export's value text is the input
// itself here, grouping thousands as it's typed (RupiahInput); its focus state (the "Fokus keyboard" example) turns
// the border blue and adds the 2px ring.
export function PriceField({ name, label, helper, prefix, suffix, defaultValue, marketLabel, marketRange, error, layout = 'inline' }: PriceFieldProps) {
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[18px_0px_0px_0px] justify-start items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0]">
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start">
        <label htmlFor={name} className="text-[15px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">
          {label}
        </label>
        <p id={`${name}-helper`} className="text-[13px]/[normal] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">
          {helper}
        </p>
      </div>
      <div className={`box-border w-full h-fit shrink-0 flex ${layout === 'stacked' ? 'flex-col gap-[10px] items-start' : 'flex-col sm:flex-row gap-[10px] sm:gap-[16px] items-start sm:items-center'} justify-start`}>
        <div className={`box-border ${layout === 'stacked' ? 'w-full' : 'w-full sm:w-auto sm:[flex:1_1_0]'} h-[52px] shrink-0 flex flex-row gap-[12px] p-[0px_16px_0px_6px] justify-start items-center bg-[#FFFFFF] ${error ? '[outline:1.5px_solid_#C23B35]' : '[outline:1px_solid_#7F8FA4]'} [outline-offset:-0.5px] rounded-[12px] focus-within:[outline-color:#0F6CB8] focus-within:[box-shadow:0px_0px_0px_2px_#FFFFFF,_0px_0px_0px_4px_#0F6CB8]`}>
          <span aria-hidden="true" className="box-border w-fit shrink-0 h-[40px] flex flex-row gap-0 p-[0px_12px] justify-start items-center bg-[#F7F9FC] rounded-[8px]">
            <span className="text-[15px]/[normal] box-border text-[#5B6B7C] font-poppins font-semibold text-left [white-space:nowrap]">{prefix}</span>
          </span>
          <RupiahInput
            id={name}
            name={name}
            defaultValue={defaultValue}
            aria-describedby={error ? `${name}-helper ${name}-error` : `${name}-helper`}
            aria-invalid={error ? true : undefined}
            className="text-[18px]/[normal] box-border [flex:1_1_0] w-0 min-w-0 self-stretch lg:self-auto bg-transparent text-[#0B3B5C] font-poppins font-semibold text-left outline-none"
          />
          <span aria-hidden="true" className="text-[14px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">
            {suffix}
          </span>
        </div>
        <div className={`box-border w-fit shrink-0 h-fit flex ${layout === 'stacked' ? 'flex-row gap-[8px] items-center' : 'flex-row sm:flex-col gap-[8px] sm:gap-[6px] items-center sm:items-start'} justify-start`}>
          <p className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{marketLabel}</p>
          <p className="box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[4px_10px] justify-start items-start bg-[#F7F9FC] rounded-[999px]">
            <span className="text-[13px]/[normal] box-border text-[#0B3B5C] font-inter font-medium text-left [white-space:nowrap]">{marketRange}</span>
          </p>
        </div>
      </div>
      {error && (
        <p id={`${name}-error`} className="box-border w-full h-fit flex flex-row gap-[8px] justify-start items-start">
          <Icon name="circle-alert" fill="#C23B35" className="box-border w-[16px] shrink-0 h-[16px] mt-[2px]" />
          <span className="text-[13px]/[20px] box-border text-[#C23B35] font-inter font-medium text-left">{error}</span>
        </p>
      )}
    </div>
  )
}
