'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/icon'
import { FormField } from '@/components/register/form-field'
import { AccountLocationFields } from '@/components/pembeli/account-location-fields'
import { SaveButton } from '@/components/pembeli/save-button'
import { useUnsavedChanges } from '@/components/pembeli/unsaved-changes'
import { useTranslations } from 'next-intl'
import { infoPribadi, type AccountValues } from '@/components/nelayan/akun-content'
import type { AccountFormState } from '@/app/nelayan/actions'

type AccountInfoFormProps = {
  initialValues: AccountValues
  action: (state: AccountFormState, formData: FormData) => Promise<AccountFormState>
}

// The nelayan Info Pribadi form, built like the pembeli one (components/pembeli/account-info-form.tsx): errors come
// back per field and focus moves to the first, edits are reported to the section guard, and "Perubahan disimpan."
// shows after a save until the next edit. The fields are the fisher's: identity, landing site, payout account.
export function AccountInfoForm({ initialValues, action }: AccountInfoFormProps) {
  const INFO_PRIBADI = infoPribadi(useTranslations('dashboard.akun'), useTranslations('auth.register'))
  const { fields, location, bank } = INFO_PRIBADI
  const [state, formAction] = useActionState(action, { status: 'idle', values: initialValues, errors: {} })
  // The save result current at the last edit. Edits are unsaved until a later result says "saved".
  const [editedAt, setEditedAt] = useState<AccountFormState | null>(null)
  const dirty = editedAt !== null && (editedAt === state || state.status !== 'saved')
  const formRef = useRef<HTMLFormElement>(null)
  const { setDirty, setSaver, reportSave } = useUnsavedChanges()
  const { values, errors } = state

  useEffect(() => setDirty(dirty), [dirty, setDirty])

  useEffect(() => {
    setSaver(() => formRef.current?.requestSubmit())
    return () => setSaver(null)
  }, [setSaver])

  // Each save returns a new state object: tell the guard, and focus the first error.
  useEffect(() => {
    if (state.status === 'idle') return
    reportSave(state.status === 'saved')
    if (state.status === 'error') formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    // reportSave changes with the guard's own state; this should run once per save result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const text = (name: keyof typeof fields) => ({
    ...fields[name],
    kind: 'text' as const,
    look: 'settings' as const,
    grow: true,
    defaultValue: values[name],
    error: errors[name],
  })

  return (
    <form ref={formRef} action={formAction} noValidate onInput={() => setEditedAt(state)}
      onChange={() => setEditedAt(state)} className="contents">
      <SectionHeading title={INFO_PRIBADI.title} subtitle={INFO_PRIBADI.subtitle} level="h2" />
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[18px] justify-start items-start">
        <Row>
          <FormField {...text('fullName')} />
          <FormField {...text('nickname')} />
        </Row>
        <Row>
          <FormField {...text('email')} />
          <FormField {...text('phone')} />
        </Row>
        <Group>
          <SectionHeading title={location.title} subtitle={location.subtitle} />
          {/* Keyed by the saved choice so the selects reopen on it after a save. */}
          <AccountLocationFields
            key={`${values.kabKota}/${values.ppi}`}
            provinsi={location.provinsi}
            kabKota={location.kabKota}
            pelabuhan={location.pelabuhan}
            defaultProvinsi={values.provinsi}
            defaultKabKota={values.kabKota}
            defaultPelabuhan={values.ppi}
            errors={{ provinsi: errors.provinsi, kabKota: errors.kabKota, pelabuhan: errors.ppi }}
          />
        </Group>
        <Group>
          <SectionHeading title={bank.title} subtitle={bank.subtitle} />
          <Row>
            <FormField {...text('bankAccount')} />
          </Row>
        </Group>
      </div>
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[16px] p-[20px_0px_0px_0px] justify-end items-center [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0]">
        {/* The "Toast" from "Menyimpan → tersimpan". A stable live region, so the message is announced when it appears. */}
        <div role="status" className="box-border [flex:1_1_0] h-fit flex flex-row justify-start items-center">
          {state.saveError && !dirty && (
            <p className="box-border w-fit h-fit flex flex-row gap-[10px] p-[12px_14px] justify-start items-center bg-[#FDECEC] rounded-[12px] motion-safe:animate-fade-in">
              <Icon name="circle-alert" fill="#C23B35" className="box-border w-[18px] shrink-0 h-[18px]" />
              <span className="text-[14px]/[20px] box-border text-[#C23B35] font-poppins font-semibold text-left">{state.saveError}</span>
            </p>
          )}
          {state.status === 'saved' && !dirty && (
            <p className="box-border w-fit h-fit flex flex-row gap-[10px] p-[12px_14px] justify-start items-center bg-[#E8F8F2] rounded-[12px] motion-safe:animate-fade-in">
              <Icon name="circle-check" fill="#17704A" className="box-border w-[18px] shrink-0 h-[18px]" />
              <span className="text-[14px]/[normal] box-border text-[#17704A] font-poppins font-semibold text-left [white-space:nowrap]">
                {INFO_PRIBADI.savedMessage}
              </span>
            </p>
          )}
        </div>
        <SaveButton label={INFO_PRIBADI.saveLabel} savingLabel={INFO_PRIBADI.savingLabel} />
      </div>
    </form>
  )
}

function SectionHeading({ title, subtitle, level = 'h3' }: { title: string; subtitle: string; level?: 'h2' | 'h3' }) {
  const Heading = level
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start">
      <Heading className={`${level === 'h2' ? 'text-[18px]/[normal]' : 'text-[16px]/[normal]'} box-border text-[#0B3B5C] font-poppins font-semibold text-left`}>
        {title}
      </Heading>
      <p className="text-[14px]/[20px] box-border text-[#5B6B7C] font-inter font-normal text-left">{subtitle}</p>
    </div>
  )
}

// A titled block under a divider, like the pembeli form's "Klasifikasi jenis usaha".
function Group({ children }: { children: React.ReactNode }) {
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[18px] p-[20px_0px_0px_0px] justify-start items-start [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0]">
      {children}
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[20px] justify-start items-start">{children}</div>
}
