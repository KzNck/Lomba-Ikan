'use client'

import { useEffect } from 'react'

// Registers public/sw.js, which shows the offline page when a page can't load without signal. Production only: in
// development it would keep serving old build files and hide changes.
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch((error) => {
      console.error('Service worker tidak terdaftar:', error)
    })
  }, [])
  return null
}
