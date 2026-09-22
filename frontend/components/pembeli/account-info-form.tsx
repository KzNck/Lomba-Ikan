'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/icon'
import { FormField } from '@/components/register/form-field'
import { ChipGroup } from '@/components/register/chip-group'
import { AccountLocationFields } from '@/components/pembeli/account-location-fields'
import { SaveButton } from '@/components/pembeli/save-button'
import { useUnsavedChanges } from '@/components/pembeli/unsaved-changes'
import { useTranslations } from 'next-intl'
import { infoPribadi, type AccountValues } from '@/components/pembeli/akun-content'
import type { AccountFormState } from '@/app/pembeli/actions'

type AccountInfoFormProps = {
  initialValues: AccountValues
  action: (state: AccountFormState, formData: FormData) => Promise<AccountFormState>
}

// The Info Pribadi section of "Form Card". Saving checks the fields on the server; errors come back per field (the
// "Validasi gagal" state) and focus moves to the first one. The form keeps what was submitted, reports unsaved edits
// to the section guard, and shows "Perubahan disimpan." after a save until the next edit.
export function AccountInfoForm({ initialValues, action }: AccountInfoFormProps) {
  const INFO_PRIBADI = infoPribadi(useTranslations('dashboard.akun'), useTranslations('auth.register'))
  const { fields } = INFO_PRIBADI
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
    if (state.status === 'error') {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [role="group"][aria-describedby*=" "] input')?.focus()
    }
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
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start">
        <h2 className="text-[18px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left lg:[white-space:nowrap]">{INFO_PRIBADI.title}</h2>
        <p className="text-[14px]/[20px] lg:text-[14px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left lg:[white-space:nowrap]">{INFO_PRIBADI.subtitle}</p>
      </div>
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[18px] justify-start items-start">
        <Row>
          <FormField {...text('contactName')} />
          <FormField {...text('nickname')} />
        </Row>
        <Row>
          <FormField {...text('businessName')} />
        </Row>
        <Row>
          <FormField {...text('email')} />
          <FormField {...text('phone')} />
        </Row>
        <Row>
          <FormField {...text('address')} />
        </Row>
        <AccountLocationFields
          provinsi={INFO_PRIBADI.provinsi}
          kabKota={INFO_PRIBADI.kabKota}
          defaultProvinsi={values.provinsi}
          defaultKabKota={values.kabKota}
          errors={{ provinsi: errors.provinsi, kabKota: errors.kabKota }}
        />
        <Row>
          <FormField {...text('kecamatan')} />
          <FormField {...text('kodePos')} />
        </Row>
        <div className="box-border w-full h-fit shrink-0 p-[20px_0px_0px_0px] [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0]">
          {/* Keyed by the saved choice so the chips' uncontrolled ticks follow a save. */}
          <ChipGroup
            key={values.jenisUsaha.join()}
            {...INFO_PRIBADI.jenisUsaha}
            look="settings"
            defaultValues={values.jenisUsaha}
            error={errors.jenisUsaha}
          />
        </div>
      </div>
      <div className="box-border w-full h-fit shrink-0 flex flex-row flex-wrap lg:flex-nowrap gap-[16px] p-[20px_0px_0px_0px] justify-end items-center [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0]">
        {/* The "Toast" from "Menyimpan → tersimpan". A stable live region, so the message is announced when it appears. */}
        <div role="status" className="box-border [flex:1_1_0] h-fit flex flex-row justify-start items-center">
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

function Row({ children }: { children: React.ReactNode }) {
  // Two fields side by side from sm; stacked on phones.
  return <div className="box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-[18px] sm:gap-[20px] justify-start items-stretch sm:items-start">{children}</div>
}
