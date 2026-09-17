type SectionHeaderProps = {
  eyebrow: string
  title: string
  subtitle?: string
  // Sizing differs per section: some subtitles wrap at a fixed width, others stay on one line.
  subtitleClassName?: string
  className?: string
}

export function SectionHeader({ eyebrow, title, subtitle, subtitleClassName = '', className = '' }: SectionHeaderProps) {
  return (
    <div data-reveal className={`box-border w-full h-fit shrink-0 flex flex-col gap-[12px] ${className} justify-start items-start`}>
      <p className="text-[13px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold tracking-[1.6px] text-left [white-space:nowrap]">
        {eyebrow}
      </p>
      <h2 className="text-[40px]/[normal] box-border text-[#0B3B5C] font-poppins font-extrabold text-left [white-space:nowrap]">
        {title}
      </h2>
      {subtitle && (
        <p className={`${subtitleClassName} box-border text-[#5B6B7C] font-inter font-normal text-left`}>{subtitle}</p>
      )}
    </div>
  )
}
