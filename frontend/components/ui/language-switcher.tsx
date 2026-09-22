'use client'

import { useEffect, useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Icon } from '@/components/ui/icon'
import { usePopover } from '@/components/ui/use-popover'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER, PRESS } from '@/components/ui/interaction'
import { LOCALES, type AppLocale } from '@/i18n/config'
import { setLocale } from '@/app/locale-actions'

// Switching sets the cookie in a server action, which re-renders the page in the new language. The transition keeps
// the current page on screen (and the options disabled) until it arrives.
function useLocaleSwitch(onSwitched?: () => void) {
  const locale = useLocale()
  const [pending, startTransition] = useTransition()
  const choose = (next: AppLocale) => {
    if (next === locale) return onSwitched?.()
    startTransition(async () => {
      await setLocale(next)
      onSwitched?.()
    })
  }
  return { locale, pending, choose }
}

type LanguageOptionsProps = {
  onSwitched?: () => void
}

// "Bahasa Indonesia" and "English", each named in its own language (and marked `lang` so it is read that way), with
// a check on the active one, which carries `data-language-active` for the navbar switcher's focus-on-open.
function LanguageOptions({ onSwitched }: LanguageOptionsProps) {
  const t = useTranslations('common.language')
  const { locale, pending, choose } = useLocaleSwitch(onSwitched)

  return (
    <div role="group" aria-label={t('label')} className="box-border w-full h-fit flex flex-col gap-[2px]">
      {LOCALES.map((code) => {
        const active = code === locale
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={active}
            disabled={pending}
            data-language-active={active || undefined}
            onClick={() => choose(code)}
            className={`box-border w-full h-[44px] lg:h-[40px] shrink-0 flex flex-row gap-[10px] p-[0px_12px] justify-start items-center rounded-[8px] cursor-pointer hover:bg-[#F7F9FC] disabled:cursor-wait disabled:opacity-70 transition-colors duration-150 ease-out ${FOCUS_RING}`}
          >
            <span
              className={`text-[14px]/[normal] box-border [flex:1_1_0] text-[#0B3B5C] font-poppins ${active ? 'font-semibold' : 'font-medium'} text-left [white-space:nowrap]`}
            >
              {t(`names.${code}`)}
            </span>
            {active && <Icon name="check" fill="#0F6CB8" className="box-border w-[16px] shrink-0 h-[16px]" />}
          </button>
        )
      })}
    </div>
  )
}

// The switcher in the landing navbar (left of "Masuk") and the dashboard headers (left of the bell): a globe with the active code ("ID"/"EN") that opens the two
// options. Escape or a press outside closes it (usePopover); opening moves focus to the active option.
export function LanguageSwitcher() {
  const t = useTranslations('common.language')
  const locale = useLocale()
  const { open, setOpen, rootRef, buttonRef, buttonProps, panelProps } = usePopover()

  useEffect(() => {
    if (!open) return
    rootRef.current?.querySelector<HTMLButtonElement>('[data-language-active]')?.focus({ preventScroll: true })
  }, [open, rootRef])

  return (
    <div ref={rootRef} className="box-border w-fit shrink-0 h-fit relative">
      <button
        {...buttonProps}
        aria-label={t('triggerLabel', { language: t(`names.${locale}`) })}
        className={`box-border w-fit shrink-0 h-[44px] flex flex-row gap-[6px] p-[0px_12px] justify-center items-center rounded-[999px] cursor-pointer ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`}
      >
        <Icon name="globe" fill="#0B3B5C" className="box-border w-[18px] shrink-0 h-[18px]" />
        <span aria-hidden="true" className="text-[15px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">
          {t(`codes.${locale}`)}
        </span>
        <Icon
          name="chevron-down"
          fill="#5B6B7C"
          className={`box-border w-[16px] shrink-0 h-[16px] transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        {...panelProps}
        className="box-border w-[200px] h-fit absolute right-0 top-[calc(100%+8px)] [box-shadow:0px_8px_24px_0px_#0B3B5C1F] p-[6px] bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[12px] [z-index:30] motion-safe:animate-fade-in"
      >
        <LanguageOptions
          onSwitched={() => {
            setOpen(false)
            // preventScroll: the pages are a fixed 1440px wide, so on a narrower window focusing would scroll sideways.
            buttonRef.current?.focus({ preventScroll: true })
          }}
        />
      </div>
    </div>
  )
}
