import { getFormatter, getTranslations } from 'next-intl/server'
import type { Presenter } from '@/lib/catches/present'
import type { AppLocale } from '@/i18n/config'

/**
 * The active (or a fixed) locale's `common` messages and formatter, for the server-side loaders that turn database rows into what
 * the UI shows (lib/catches/present.ts and its callers). Get it once per request and pass it down.
 */
export async function getPresenter(locale?: AppLocale): Promise<Presenter> {
  // A fixed `locale` is for text written to someone else, e.g. the WhatsApp message to a fisher (always Indonesian).
  const [t, format] = await Promise.all([
    locale ? getTranslations({ locale, namespace: 'common' }) : getTranslations('common'),
    locale ? getFormatter({ locale }) : getFormatter(),
  ])
  return { t, format }
}
