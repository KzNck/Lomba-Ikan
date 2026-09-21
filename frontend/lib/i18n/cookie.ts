import { cookies } from 'next/headers'
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, type AppLocale } from '@/i18n/config'

/** Remember the interface language in the cookie i18n/request.ts reads. Server actions and route handlers only. */
export async function writeLocaleCookie(locale: AppLocale): Promise<void> {
  const store = await cookies()
  store.set(LOCALE_COOKIE, locale, { path: '/', maxAge: LOCALE_COOKIE_MAX_AGE, sameSite: 'lax' })
}
