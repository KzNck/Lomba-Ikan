'use server'

import { isLocale } from '@/i18n/config'
import { writeLocaleCookie } from '@/lib/i18n/cookie'
import { createClient } from '@/lib/supabase/server'

/**
 * Set the interface language. The cookie is what i18n/request.ts reads; setting it here re-renders the current page
 * in the new language. A signed-in user's choice is also kept in their auth `user_metadata` (profiles has no column
 * for it), so signing in on another device brings it back.
 */
export async function setLocale(locale: string): Promise<void> {
  if (!isLocale(locale)) return

  await writeLocaleCookie(locale)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user && user.user_metadata?.locale !== locale) {
    // Best effort: the cookie already switched the language, so a failed save only loses it on other devices.
    await supabase.auth.updateUser({ data: { locale } })
  }
}
