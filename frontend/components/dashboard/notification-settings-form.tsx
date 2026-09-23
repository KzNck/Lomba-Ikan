'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Icon } from '@/components/ui/icon'
import { SaveButton } from '@/components/pembeli/save-button'
import { useUnsavedChanges } from '@/components/pembeli/unsaved-changes'
import { NOTIFICATION_TOPICS, type NotificationRole, type NotificationSettings } from '@/lib/notification-topics'
import type { NotificationFormState } from '@/app/notification-actions'

type NotificationSettingsFormProps = {
  role: NotificationRole
  initialValues: NotificationSettings
  action: (state: NotificationFormState, formData: FormData) => Promise<NotificationFormState>
}

// Akun › Notifikasi (designv2 §13): one switch per kind of news in the header bell, for the signed-in role. Like
// Preferensi, it reports unsaved edits to the section guard and shows "Perubahan disimpan." after a save.
export function NotificationSettingsForm({ role, initialValues, action }: NotificationSettingsFormProps) {
  const t = useTranslations('dashboard.akun')
  const [state, formAction] = useActionState(action, { status: 'idle', values: initialValues })
  const [editedAt, setEditedAt] = useState<NotificationFormState | null>(null)
  const dirty = editedAt !== null && (editedAt === state || state.status !== 'saved')
  const formRef = useRef<HTMLFormElement>(null)
  const { setDirty, setSaver, reportSave } = useUnsavedChanges()

  useEffect(() => setDirty(dirty), [dirty, setDirty])

  useEffect(() => {
    setSaver(() => formRef.current?.requestSubmit())
    return () => setSaver(null)
  }, [setSaver])

  useEffect(() => {
    if (state.status !== 'idle') reportSave(state.status === 'saved')
    // reportSave changes with the guard's own state; this should run once per save result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  // Keyed by the saved values so the uncontrolled switches follow a save.
  const savedKey = NOTIFICATION_TOPICS[role].map((topic) => Number(state.values[topic])).join('')

  return (
    <form ref={formRef} action={formAction} onChange={() => setEditedAt(state)} className="contents">
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start">
        <h2 className="text-[18px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left">{t('notifications.title')}</h2>
        <p className="text-[14px]/[21px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{t('notifications.subtitle')}</p>
      </div>
      <ul key={savedKey} className="box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-stretch">
        {NOTIFICATION_TOPICS[role].map((topic, index) => (
          <li
            key={topic}
            className={`box-border w-full h-fit ${index > 0 ? '[border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0]' : ''}`}
          >
            <label className="box-border w-full min-h-[64px] flex flex-row gap-[16px] p-[14px_0px] justify-between items-center cursor-pointer">
              <span className="box-border [flex:1_1_0] min-w-0 flex flex-col gap-[2px] justify-start items-start">
                <span className="text-[15px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left">
                  {t(`notifications.topics.${topic}.label`)}
                </span>
                <span className="text-[13px]/[19px] box-border text-[#5B6B7C] font-inter font-normal text-left">
                  {t(`notifications.topics.${topic}.description`)}
                </span>
              </span>
              {/* A native checkbox announced as a switch; the track and knob are drawn from its checked state. */}
              <input type="checkbox" role="switch" name={topic} defaultChecked={state.values[topic]} className="peer sr-only" />
              <span
                aria-hidden="true"
                className="box-border w-[44px] h-[26px] shrink-0 flex flex-row p-[3px] justify-start items-center bg-[#7F8FA4] peer-checked:bg-[#0F6CB8] peer-checked:[&>span]:translate-x-[18px] rounded-[999px] transition-colors duration-150 ease-out peer-focus-visible:[box-shadow:0px_0px_0px_2px_#FFFFFF,_0px_0px_0px_4px_#0F6CB8]"
              >
                <span className="box-border w-[20px] h-[20px] shrink-0 bg-[#FFFFFF] rounded-[999px] [box-shadow:0px_1px_2px_0px_#0B3B5C33] motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out" />
              </span>
            </label>
          </li>
        ))}
      </ul>
      <p className="box-border w-full h-fit shrink-0 flex flex-row gap-[10px] p-[12px_14px] justify-start items-start bg-[#F3FAFF] rounded-[12px]">
        <Icon name="info" fill="#0F6CB8" className="box-border w-[16px] shrink-0 h-[16px] mt-[1px]" />
        <span className="text-[13px]/[19px] box-border [flex:1_1_0] text-[#0B3B5C] font-inter font-normal text-left">{t('notifications.channelNote')}</span>
      </p>
      <div className="box-border w-full h-fit shrink-0 flex flex-row flex-wrap lg:flex-nowrap gap-[16px] p-[20px_0px_0px_0px] justify-end items-center [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0]">
        {/* A stable live region, so the result is announced when it appears. */}
        <div role="status" className="box-border [flex:1_1_0] h-fit flex flex-row justify-start items-center">
          {state.status === 'saved' && !dirty && (
            <p className="box-border w-fit h-fit flex flex-row gap-[10px] p-[12px_14px] justify-start items-center bg-[#E8F8F2] rounded-[12px] motion-safe:animate-fade-in">
              <Icon name="circle-check" fill="#17704A" className="box-border w-[18px] shrink-0 h-[18px]" />
              <span className="text-[14px]/[normal] box-border text-[#17704A] font-poppins font-semibold text-left [white-space:nowrap]">{t('saved')}</span>
            </p>
          )}
          {state.status === 'error' && (
            <p className="box-border w-fit h-fit flex flex-row gap-[10px] p-[12px_14px] justify-start items-center bg-[#FDECEC] rounded-[12px]">
              <Icon name="circle-alert" fill="#9B2C27" className="box-border w-[18px] shrink-0 h-[18px]" />
              <span className="text-[14px]/[normal] box-border text-[#9B2C27] font-inter font-medium text-left">{state.error}</span>
            </p>
          )}
        </div>
        <SaveButton label={t('save')} savingLabel={t('saving')} />
      </div>
    </form>
  )
}
