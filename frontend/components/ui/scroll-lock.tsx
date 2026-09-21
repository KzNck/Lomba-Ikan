'use client'

import { useEffect } from 'react'

// Stops the page behind a modal from scrolling while this is mounted. The modals are server components, so they
// render this instead of locking the scroll themselves.
export function ScrollLock() {
  useEffect(() => {
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [])

  return null
}
