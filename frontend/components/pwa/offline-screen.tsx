'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { PRESS, SOLID_HOVER } from '@/components/ui/interaction'
import { CatchWizard } from '@/components/nelayan/catch-wizard'
import { queuedCount, subscribeQueuedCount } from '@/lib/offline/storage'

// How often to check again while the server is out of reach.
const PROBE_EVERY = 15_000

/**
 * Whether the server answers, not just whether the device has a network: port Wi-Fi without internet still reads as
 * "online" to the browser. The manifest is small and the service worker doesn't answer for it, so fetching it is a
 * real round trip. Starts at false: this page is shown because a load just failed.
 */
function useServerReachable() {
  const [reachable, setReachable] = useState(false)
  useEffect(() => {
    let cancelled = false
    const probe = () =>
      fetch('/manifest.webmanifest', { cache: 'no-store' })
        .then((response) => response.ok)
        .catch(() => false)
        .then((ok) => {
          if (!cancelled) setReachable(ok)
        })
    void probe()
    const timer = window.setInterval(probe, PROBE_EVERY)
    window.addEventListener('online', probe)
    window.addEventListener('offline', probe)
    return () => {
      cancelled = true
      window.clearInterval(timer)
      window.removeEventListener('online', probe)
      window.removeEventListener('offline', probe)
    }
  }, [])
  return reachable
}

// The offline page's content: what happened, "Catat tangkapan", and how many catches are waiting on this device.
// Once the signal returns it points to the dashboard, where OfflineSync sends them.
export function OfflineScreen() {
  const t = useTranslations('offline')
  const [logging, setLogging] = useState(false)
  const online = useServerReachable()
  const queued = useSyncExternalStore(subscribeQueuedCount, queuedCount, () => 0)

  return (
    <div className="box-border w-full min-h-dvh flex flex-col gap-0 p-[16px] justify-center items-center bg-[#F7F9FC]">
      <section className="box-border w-full max-w-[520px] h-fit flex flex-col gap-[20px] p-[24px] sm:p-[32px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[24px] [box-shadow:0px_2px_10px_0px_#1423310D]">
        <span className="box-border w-[48px] h-[48px] shrink-0 flex justify-center items-center bg-[#F3FAFF] rounded-[999px]">
          <Icon name="fish" fill="#0F6CB8" className="box-border w-[24px] h-[24px]" />
        </span>
        <div className="box-border w-full h-fit flex flex-col gap-[8px] justify-start items-start">
          <h1 className="text-[22px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left">
            {online ? t('onlineTitle') : t('title')}
          </h1>
          <p className="text-[15px]/[23px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left [text-wrap:pretty]">
            {online ? t('onlineBody') : t('body')}
          </p>
        </div>
        {/* A stable live region: the count changes as catches are saved or sent. */}
        <p role="status" className="box-border w-full h-fit text-[14px]/[20px] text-[#0B3B5C] font-inter font-medium text-left">
          {queued > 0 ? t('queued', { count: queued }) : ''}
        </p>
        <div className="box-border w-full h-fit flex flex-col sm:flex-row gap-[12px] justify-start items-stretch">
          <button
            type="button"
            onClick={() => setLogging(true)}
            className={`box-border [flex:1_1_0] min-h-[48px] flex flex-row gap-[8px] p-[12px_20px] justify-center items-center bg-[#0F6CB8] rounded-[999px] cursor-pointer ${SOLID_HOVER} ${PRESS} ${FOCUS_RING}`}
          >
            <Icon name="plus" fill="#FFFFFF" className="box-border w-[18px] shrink-0 h-[18px]" />
            <span className="text-[15px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">{t('logCatch')}</span>
          </button>
          {online && (
            // A full page load, not a client navigation: the dashboard isn't in this page's router cache.
            <a
              href="/nelayan"
              className={`box-border [flex:1_1_0] min-h-[48px] flex flex-row gap-[8px] p-[12px_20px] justify-center items-center bg-[#FFFFFF] [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] rounded-[999px] hover:bg-[#F3FAFF] ${PRESS} ${FOCUS_RING}`}
            >
              <Icon name="house" fill="#0F6CB8" className="box-border w-[18px] shrink-0 h-[18px]" />
              <span className="text-[15px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">{t('openDashboard')}</span>
            </a>
          )}
        </div>
      </section>
      {logging && <CatchWizard exitHref="/offline" />}
    </div>
  )
}
