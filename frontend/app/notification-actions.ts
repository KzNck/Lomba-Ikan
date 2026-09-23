'use server'

import { revalidatePath } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import { requireProfile } from '@/lib/supabase/auth'
import { NOTIFICATION_TOPICS, saveNotificationSettings, type NotificationSettings } from '@/lib/notification-settings'

export type NotificationFormState = {
  status: 'idle' | 'saved' | 'error'
  // What was saved (or submitted), so the switches keep showing it after React resets the form.
  values: NotificationSettings
  error?: string
}

// Akun › Notifikasi, for either role: which kinds of news show in the header bell. A switch left off isn't sent at
// all, so every topic of the role is read from the form, present or not.
export async function saveNotifications(previous: NotificationFormState, formData: FormData): Promise<NotificationFormState> {
  const profile = await requireProfile()
  const role = profile.role === 'pembeli' ? 'pembeli' : 'nelayan'
  const chosen = Object.fromEntries(NOTIFICATION_TOPICS[role].map((topic) => [topic, formData.get(topic) === 'on']))
  const values = { ...previous.values, ...chosen }

  try {
    await saveNotificationSettings(role, chosen)
  } catch (error) {
    console.error('saveNotifications:', error)
    return { status: 'error', values, error: (await getTranslations('dashboard.akun'))('notifications.failed') }
  }

  // The bell is in every page's header of the area.
  revalidatePath(role === 'pembeli' ? '/pembeli' : '/nelayan', 'layout')
  if (role === 'pembeli') revalidatePath('/marketplace', 'layout')
  return { status: 'saved', values }
}
