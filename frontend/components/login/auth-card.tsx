import { BackLink } from '@/components/login/back-link'
import type { NavItem } from '@/components/home/navbar'

type AuthCardProps = {
  // Shown above the heading, e.g. "← Ganti email" on the OTP step.
  backLink?: NavItem
  title: string
  subtitle: string
  children: React.ReactNode
}

// The white login card: heading, then the card's sections on its 28px rhythm (20px, with less padding, on short
// windows so the login page fits without scrolling).
export function AuthCard({ backLink, title, subtitle, children }: AuthCardProps) {
  return (
    <div className="box-border w-[580px] h-fit [box-shadow:0px_0px_0px_1px_#0000000F,_0px_1px_2px_-1px_#0000000F,_0px_16px_40px_0px_#0B3B5C14] flex flex-col gap-[28px] short:gap-[20px] p-[48px] short:p-[32px_40px] justify-start items-start bg-[#FFFFFF] rounded-[24px]">
      {backLink && <BackLink {...backLink} />}
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start">
        <h1 className="text-[32px]/[38px] box-border w-full text-[#0B3B5C] font-poppins font-extrabold text-left">{title}</h1>
        <p className="text-[16px]/[24px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}
