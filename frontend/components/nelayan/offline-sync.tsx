'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { LISTING_PATH } from '@/components/nelayan/listing-content'
import { syncOfflineCatch } from '@/app/nelayan/actions'
import { listQueued, removeQueued, type QueuedCatch } from '@/lib/offline/storage'

type SyncState = { kind: 'sending' | 'sent' | 'waiting'; count: number } | null

function toFormData({ localId, catchTime, answers, photo }: QueuedCatch): FormData {
  const form = new FormData()
  form.set('local_id', localId)
  form.set('catch_time', catchTime)
  form.set('category', answers.category)
  if (answers.otherName) form.set('lainnya', answers.otherName)
  form.set('weight', String(answers.weight))
  form.set('time', answers.time)
  form.set('kondisi', answers.condition)
  form.set('ice', answers.ice)
  form.set('photo', photo, 'catch.jpg')
  return form
}

// Sends the catches queued on this device (lib/offline/storage.ts) once it's online: when a fisher page opens, and
// whenever the connection comes back. One at a time, oldest first; each is saved and graded like an online catch,
// then removed from the device. Mounted once in the fisher layout, so it runs on every fisher page.
export function OfflineSync() {
  const t = useTranslations('dashboard.nelayan.offlineSync')
  const [state, setState] = useState<SyncState>(null)
  const running = useRef(false)

  const sendQueued = useCallback(async () => {
    if (running.current || !navigator.onLine) return
    running.current = true
    try {
      const queued = await listQueued()
      if (queued.length === 0) return
      setState({ kind: 'sending', count: queued.length })

      let sent = 0
      for (const entry of queued) {
        const result = await syncOfflineCatch(toFormData(entry)).catch(() => null)
        // No answer (signal dropped again) or a server error: keep the rest for the next try.
        if (!result) break
        if (result.status === 'synced') {
          await removeQueued(entry.localId)
          sent++
        }
        // 'invalid' stays queued and counts as waiting; the sign-out warning keeps it from being lost unnoticed.
      }

      const left = queued.length - sent
      setState(left > 0 ? { kind: 'waiting', count: left } : { kind: 'sent', count: sent })
    } finally {
      running.current = false
    }
  }, [])

  useEffect(() => {
    void sendQueued()
    window.addEventListener('online', sendQueued)
    return () => window.removeEventListener('online', sendQueued)
  }, [sendQueued])

  const tone = {
    sending: { bg: 'bg-[#FFFFFF]', fill: '#0F6CB8', text: 'text-[#0B3B5C]', icon: 'loader-circle' as const },
    sent: { bg: 'bg-[#E8F8F2]', fill: '#17704A', text: 'text-[#17704A]', icon: 'circle-check' as const },
    waiting: { bg: 'bg-[#FFF4E0]', fill: '#8A5100', text: 'text-[#8A5100]', icon: 'circle-alert' as const },
  }

  return (
    // A stable live region, so each message is announced when it appears. Above the tab bar below lg.
    <div
      role="status"
      className="box-border fixed right-[16px] left-[16px] sm:left-auto bottom-[calc(80px_+_env(safe-area-inset-bottom))] lg:bottom-[24px] lg:right-[24px] z-50 flex justify-end pointer-events-none"
    >
      {state && (
        <div
          className={`box-border w-full sm:w-[380px] h-fit flex flex-row gap-[12px] p-[14px_16px] justify-start items-start ${tone[state.kind].bg} [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[16px] [box-shadow:0px_12px_32px_0px_#0B3B5C29] pointer-events-auto motion-safe:animate-fade-up`}
        >
          <Icon
            name={tone[state.kind].icon}
            fill={tone[state.kind].fill}
            className={`box-border w-[20px] shrink-0 h-[20px] mt-[1px] ${state.kind === 'sending' ? 'motion-safe:animate-spin' : ''}`}
          />
          <div className="box-border [flex:1_1_0] min-w-0 flex flex-col gap-[6px] justify-start items-start">
            <p className={`text-[14px]/[20px] box-border ${tone[state.kind].text} font-poppins font-semibold text-left`}>
              {t(state.kind, { count: state.count })}
            </p>
            {state.kind === 'waiting' && (
              // A server error isn't fixed by the signal returning, so the fisher can retry by hand too.
              <button
                type="button"
                onClick={() => void sendQueued()}
                className={`text-[14px]/[20px] box-border text-[#0F6CB8] font-inter font-semibold underline underline-offset-[3px] rounded-[4px] cursor-pointer ${FOCUS_RING}`}
              >
                {t('retry')}
              </button>
            )}
            {state.kind === 'sent' && (
              <Link
                href={LISTING_PATH}
                onClick={() => setState(null)}
                className={`text-[14px]/[20px] box-border text-[#0F6CB8] font-inter font-semibold underline underline-offset-[3px] rounded-[4px] ${FOCUS_RING}`}
              >
                {t('view')}
              </Link>
            )}
          </div>
          {state.kind !== 'sending' && (
            <button
              type="button"
              onClick={() => setState(null)}
              aria-label={t('close')}
              className={`box-border w-[32px] h-[32px] mt-[-6px] mr-[-8px] shrink-0 flex justify-center items-center rounded-[999px] cursor-pointer hover:bg-[#0B3B5C0F] ${FOCUS_RING}`}
            >
              <Icon name="x" fill="#5B6B7C" className="box-border w-[16px] h-[16px]" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
