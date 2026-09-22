'use client'

import { createContext, useContext } from 'react'
import type { NotificationFeed } from '@/lib/notifications'

export type NotificationsValue = NotificationFeed & { role: 'nelayan' | 'pembeli' }

const NotificationsContext = createContext<NotificationsValue | null>(null)

// The role layouts load the feed once (lib/notifications.ts) and hand it to the header bell through this, so the
// pages under them don't each have to pass it along.
export function NotificationsProvider({ value, children }: { value: NotificationsValue; children: React.ReactNode }) {
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}

export function useNotifications(): NotificationsValue {
  const value = useContext(NotificationsContext)
  if (!value) throw new Error('useNotifications must be used inside a NotificationsProvider')
  return value
}
