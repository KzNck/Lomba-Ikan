import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import type { Formats } from 'next-intl'
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from '@/i18n/config'

// Named formats shared by every formatter call, so rupiah and dates look the same everywhere.
export const formats = {
  number: {
    // "Rp 8.000" in id, "Rp 8,000" in en: whole rupiah, symbol rather than the "IDR" code.
    rupiah: { style: 'currency', currency: 'IDR', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 },
    // Weights are estimates: at most one decimal.
    weight: { maximumFractionDigits: 1 },
  },
  dateTime: {
    // "21 Sep 2026"
    day: { day: 'numeric', month: 'short', year: 'numeric' },
    // "14.30" in id, "14:30" in en
    time: { hour: '2-digit', minute: '2-digit', hour12: false },
  },
} satisfies Formats

// The locale comes from the cookie the language switcher sets (app/locale-actions.ts). Signing in copies the
// account's saved choice into it, so it follows the user across devices.
export default getRequestConfig(async () => {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value
  const locale = isLocale(saved) ? saved : DEFAULT_LOCALE

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    formats,
    // Listings, deadlines and PPI hours are all Indonesian: render times in WIB on the server and the client alike.
    timeZone: 'Asia/Jakarta',
  }
})
