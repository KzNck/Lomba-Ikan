type PriceFieldProps = {
  name: string
  label: string
  helper: string
  prefix: string
  suffix: string
  defaultValue: string
  marketLabel: string
  marketRange: string
}

// "Harga Jual": a rupiah-per-kg input with the market range beside it. The export's value text is the input
// itself here; its focus state (the "Fokus keyboard" example) turns the border blue and adds the 2px ring.
export function PriceField({ name, label, helper, prefix, suffix, defaultValue, marketLabel, marketRange }: PriceFieldProps) {
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
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[16px] justify-start items-center">
        <div className="box-border [flex:1_1_0] h-[52px] flex flex-row gap-[12px] p-[0px_16px_0px_6px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#7F8FA4] [outline-offset:-0.5px] rounded-[12px] focus-within:[outline-color:#0F6CB8] focus-within:[box-shadow:0px_0px_0px_2px_#FFFFFF,_0px_0px_0px_4px_#0F6CB8]">
          <span aria-hidden="true" className="box-border w-fit shrink-0 h-[40px] flex flex-row gap-0 p-[0px_12px] justify-start items-center bg-[#F7F9FC] rounded-[8px]">
            <span className="text-[15px]/[normal] box-border text-[#5B6B7C] font-poppins font-semibold text-left [white-space:nowrap]">{prefix}</span>
          </span>
          <input
            id={name}
            name={name}
            inputMode="numeric"
            defaultValue={defaultValue}
            aria-describedby={`${name}-helper`}
            className="text-[18px]/[normal] box-border [flex:1_1_0] w-0 min-w-0 bg-transparent text-[#0B3B5C] font-poppins font-semibold text-left outline-none"
          />
          <span aria-hidden="true" className="text-[14px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">
            {suffix}
          </span>
        </div>
        <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-[6px] justify-start items-start">
          <p className="text-[12px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">{marketLabel}</p>
          <p className="box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[4px_10px] justify-start items-start bg-[#F7F9FC] rounded-[999px]">
            <span className="text-[13px]/[normal] box-border text-[#0B3B5C] font-inter font-medium text-left [white-space:nowrap]">{marketRange}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
