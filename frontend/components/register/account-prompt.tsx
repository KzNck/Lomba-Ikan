import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import type { NavItem } from '@/components/home/navbar'
import { ARROW_NUDGE_RIGHT } from '@/components/ui/interaction'

// Pilih Role hugs the prompt; the login card centres it across the card's width.
const PROMPT_LAYOUTS = {
  hug: 'w-fit justify-start',
  centered: 'w-full justify-center',
}

type AccountPromptProps = {
  question: string
  link: NavItem
  layout?: keyof typeof PROMPT_LAYOUTS
}

// "Sudah punya akun? Masuk di sini →" and its mirror on the login page.
export function AccountPrompt({ question, link, layout = 'hug' }: AccountPromptProps) {
  return (
    <div className={`box-border ${PROMPT_LAYOUTS[layout]} h-fit shrink-0 flex flex-row gap-[8px] items-center`}>
      <p className="text-[15px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left [white-space:nowrap]">
        {question}
      </p>
      <Link
        href={link.href}
        className="group box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] p-[10px_4px] justify-start items-center"
      >
        <span className="text-[15px]/[normal] box-border text-[#0F6CB8] font-inter font-semibold text-left [white-space:nowrap]">
          {link.label}
        </span>
        <Icon name="arrow-right" fill="#0F6CB8" className={`box-border w-[16px] shrink-0 h-[16px] ${ARROW_NUDGE_RIGHT}`} />
      </Link>
    </div>
  )
}
