export type SubStepProgressContent = {
  // One-based part the user is on. Bars up to and including it are filled.
  current: number
  total: number
  label: string
}

export function SubStepProgress({ current, total, label }: SubStepProgressContent) {
  return (
    <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-[8px] justify-start items-start">
      <div aria-hidden="true" className="box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className={`box-border w-[40px] shrink-0 h-[4px] ${index < current ? 'bg-[#0F6CB8]' : 'bg-[#C5DDF0]'} rounded-[999px]`}
          />
        ))}
      </div>
      <p className="text-[14px]/[normal] box-border text-[#5B6B7C] font-inter font-medium text-left [white-space:nowrap]">
        {label}
      </p>
    </div>
  )
}
