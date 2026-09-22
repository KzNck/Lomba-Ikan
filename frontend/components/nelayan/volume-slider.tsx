type VolumeSliderProps = {
  name: string
  value: number
  min: number
  max: number
  unit: string
  labelledBy: string
  describedBy: string
  invalid: boolean
  onChange: (value: number) => void
}

// The "Slider": the export's rail, fill and thumb, driven by a transparent native range input laid over the
// track (it supplies dragging, keyboard arrows and the form value). --fill is the filled share of the rail; the
// thumb centres on the fill's end but stays inside the rail, so at 0 it sits flush left as in the error state.
// The focus ring is the shared 2px ring pushed out 1px, past the thumb's outline, which overhangs its box by 1.5px.
export function VolumeSlider({ name, value, min, max, unit, labelledBy, describedBy, invalid, onChange }: VolumeSliderProps) {
  const fill = `${((value - min) / (max - min)) * 100}%`

  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] p-[8px_0px_0px_0px] justify-start items-start">
      <div style={{ '--fill': fill } as React.CSSProperties} className="box-border w-full h-[24px] shrink-0 relative">
        <input
          type="range"
          name={name}
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          aria-valuetext={`${value} ${unit}`}
          aria-invalid={invalid || undefined}
          className="peer box-border absolute inset-0 w-full h-full m-0 opacity-0 cursor-pointer [z-index:3]"
        />
        <div className="box-border w-full md:w-[656px] h-[6px] absolute left-0 top-[9px] bg-[#E2E8F0] rounded-[3px] [z-index:0]" />
        <div className="box-border w-[var(--fill)] h-[6px] absolute left-0 top-[9px] bg-[#0F6CB8] rounded-[3px] [z-index:1]" />
        <div className="box-border w-[24px] h-[24px] [box-shadow:0px_2px_6px_0px_#0B3B5C26] peer-focus-visible:[box-shadow:0px_2px_6px_0px_#0B3B5C26,_0px_0px_0px_3px_#FFFFFF,_0px_0px_0px_5px_#0F6CB8] absolute left-[clamp(0px,calc(var(--fill)-12px),calc(100%-24px))] top-0 bg-[#FFFFFF] [outline:3px_solid_#0F6CB8] [outline-offset:-1.5px] rounded-full [z-index:2]" />
      </div>
      <div aria-hidden="true" className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-start">
        <span className="text-[13px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">
          {min} {unit}
        </span>
        <span className="text-[13px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">
          {max} {unit}
        </span>
      </div>
    </div>
  )
}
