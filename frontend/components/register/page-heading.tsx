type PageHeadingProps = {
  title: string
  subtitle: string
}

export function PageHeading({ title, subtitle }: PageHeadingProps) {
  return (
    <div className="box-border w-fit h-fit shrink-0 flex flex-col gap-[12px] justify-start items-center">
      <h1 className="text-[40px]/[46px] box-border text-[#0B3B5C] font-poppins font-bold text-left [white-space:nowrap]">
        {title}
      </h1>
      <p className="text-[17px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">
        {subtitle}
      </p>
    </div>
  )
}
