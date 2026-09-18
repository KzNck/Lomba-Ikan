import Link from 'next/link'
import { Icon, type IconName } from '@/components/ui/icon'
import { Logo } from '@/components/ui/logo'
import type { NavItem } from '@/components/home/navbar'

export type FooterContact = {
  icon: IconName
  text: string
}

export type FooterSocial = {
  icon: IconName
  label: string
}

type FooterProps = {
  tagline: string
  quickLinksHeading: string
  quickLinks: NavItem[]
  contactHeading: string
  contacts: FooterContact[]
  socialHeading: string
  socials: FooterSocial[]
  copyright: string
  legalItems: string[]
}

export function Footer({
  tagline,
  quickLinksHeading,
  quickLinks,
  contactHeading,
  contacts,
  socialHeading,
  socials,
  copyright,
  legalItems,
}: FooterProps) {
  return (
    <footer className="box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start">
      <div className="box-border w-full h-[90px] shrink-0 overflow-hidden relative" aria-hidden="true">
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="box-border w-full h-[90px] absolute left-0 top-0 overflow-visible [z-index:0]"
        >
          <path d="M0 40 C 240 0 520 70 800 40 C 1060 12 1260 10 1440 30 L1440 90 L0 90 Z" fill="#1F7FB080" />
        </svg>
        <svg
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="box-border w-full h-[70px] absolute left-0 top-[20px] overflow-visible [z-index:1]"
        >
          <path d="M0 45 C 320 0 620 60 940 30 C 1160 10 1320 30 1440 18 L1440 70 L0 70 Z" fill="#0F5C82" />
        </svg>
      </div>
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[36px] pt-[24px] pb-[32px] px-frame justify-start items-start bg-[#0F5C82]">
        <div data-reveal className="box-border w-full h-fit shrink-0 flex flex-row gap-[48px] justify-start items-start">
          <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[16px] justify-start items-start">
            <Logo tone="light" />
            <p className="text-[14px]/[22px] box-border w-[320px] text-[#D6E9F5] font-inter font-normal text-left">
              {tagline}
            </p>
          </div>
          <nav className="box-border w-[200px] shrink-0 h-fit flex flex-col gap-[12px] justify-start items-start">
            <FooterHeading>{quickLinksHeading}</FooterHeading>
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px]/[normal] box-border text-[#D6E9F5] hover:text-[#FFFFFF] transition-colors duration-200 ease-out font-inter font-normal text-left [white-space:nowrap]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="box-border w-[260px] shrink-0 h-fit flex flex-col gap-[12px] justify-start items-start">
            <FooterHeading>{contactHeading}</FooterHeading>
            {contacts.map((contact) => (
              <div
                key={contact.text}
                className="box-border w-fit h-fit shrink-0 flex flex-row gap-[10px] justify-start items-center"
              >
                <Icon name={contact.icon} fill="#D6E9F5" className="box-border w-[16px] shrink-0 h-[16px]" />
                <span className="text-[14px]/[normal] box-border text-[#D6E9F5] font-inter font-normal text-left [white-space:nowrap]">
                  {contact.text}
                </span>
              </div>
            ))}
          </div>
          <div className="box-border w-[160px] shrink-0 h-fit flex flex-col gap-[14px] justify-start items-start">
            <FooterHeading>{socialHeading}</FooterHeading>
            <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-[12px] justify-start items-start">
              {socials.map((social) => (
                <span
                  key={social.icon}
                  role="img"
                  aria-label={social.label}
                  className="box-border w-[36px] shrink-0 h-[36px] flex flex-row gap-0 justify-center items-center bg-[#FFFFFF1F] rounded-[999px]"
                >
                  <Icon name={social.icon} fill="#FFFFFF" className="box-border w-[18px] shrink-0 h-[18px]" />
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="box-border w-full h-[1px] shrink-0 bg-[#FFFFFF26]" />
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
          <p className="text-[13px]/[normal] box-border text-[#B9D6E8] font-inter font-normal text-left [white-space:nowrap]">
            {copyright}
          </p>
          <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[32px] justify-start items-start">
            {legalItems.map((item) => (
              <span
                key={item}
                className="text-[13px]/[normal] box-border text-[#B9D6E8] font-inter font-normal text-left [white-space:nowrap]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterHeading({ children }: { children: string }) {
  return (
    <p className="text-[15px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
      {children}
    </p>
  )
}
