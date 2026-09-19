// The two register frames style their headings differently; each variant is copied from its frame.
const HEADING_VARIANTS = {
  // 03 Registrasi Nelayan: one-line subtitle.
  nowrap: {
    title: 'font-bold',
    subtitle: 'text-[17px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]',
  },
  // 04a Registrasi Pembeli: heavier title, subtitle wraps in a centred 620px column.
  wrapped: {
    title: 'font-extrabold',
    subtitle: 'text-[17px]/[27px] box-border w-[620px] text-[#5B6B7C] font-inter font-normal text-center',
  },
}

export type PageHeadingProps = {
  title: string
  subtitle: string
  variant?: keyof typeof HEADING_VARIANTS
}

export function PageHeading({ title, subtitle, variant = 'nowrap' }: PageHeadingProps) {
  const styles = HEADING_VARIANTS[variant]

  return (
    <div className="box-border w-fit h-fit shrink-0 flex flex-col gap-[12px] justify-start items-center">
      <h1
        className={`text-[40px]/[46px] box-border text-[#0B3B5C] font-poppins ${styles.title} text-left [white-space:nowrap] motion-safe:animate-fade-up`}
        style={{ animationDelay: '100ms' }}
      >
        {title}
      </h1>
      <p className={`${styles.subtitle} motion-safe:animate-fade-up`} style={{ animationDelay: '200ms' }}>
        {subtitle}
      </p>
    </div>
  )
}
