import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import type { NavItem } from '@/components/home/navbar'

type LoginPromptProps = {
  question: string
  link: NavItem
}

export function LoginPrompt({ question, link }: LoginPromptProps) {
  return (
    <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center">
      <p className="text-[15px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">
        {question}
      </p>
      <Link
        href={link.href}
        className="box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] p-[10px_4px] justify-start items-center"
      >
        <span className="text-[15px]/[normal] box-border text-[#0F6CB8] font-inter font-semibold text-left [white-space:nowrap]">
          {link.label}
        </span>
        <Icon name="arrow-right" fill="#0F6CB8" className="box-border w-[16px] shrink-0 h-[16px]" />
      </Link>
    </div>
  )
}
