// The app's locales. English is the default; the active one lives in a cookie (no URL prefix), so every
// existing URL keeps working. See i18n/request.ts for how a request picks its locale.
export const LOCALES = ['id', 'en'] as const
export type AppLocale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = 'en'

// next-intl's own cookie name, so its tooling recognises it.
export const LOCALE_COOKIE = 'NEXT_LOCALE'
// A year: the choice should outlive the session.
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function isLocale(value: unknown): value is AppLocale {
  return LOCALES.includes(value as AppLocale)
}
