import { getFormatter, getTranslations } from 'next-intl/server'
import type { Presenter } from '@/lib/catches/present'

/**
 * The active locale's `common` messages and formatter, for the server-side loaders that turn database rows into what
 * the UI shows (lib/catches/present.ts and its callers). Get it once per request and pass it down.
 */
export async function getPresenter(): Promise<Presenter> {
  const [t, format] = await Promise.all([getTranslations('common'), getFormatter()])
  return { t, format }
}
