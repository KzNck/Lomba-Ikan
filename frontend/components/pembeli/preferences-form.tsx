'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Icon } from '@/components/ui/icon'
import { Chip } from '@/components/register/chip'
import { GradeGroup } from '@/components/register/grade-group'
import { PpiCombobox } from '@/components/register/ppi-combobox'
import { PreferenceSection } from '@/components/register/preference-section'
import { SaveButton } from '@/components/pembeli/save-button'
import { useUnsavedChanges } from '@/components/pembeli/unsaved-changes'
import { pembeliPreferensi } from '@/components/register/content'
import type { PreferenceValues } from '@/lib/pembeli/preferences'
import type { PreferencesFormState } from '@/app/pembeli/actions'

type PreferencesFormProps = {
  initialValues: PreferenceValues
  action: (state: PreferencesFormState, formData: FormData) => Promise<PreferencesFormState>
}

// The Preferensi section: registration's part 2 (jenis bahan, grade, PPI prioritas), opening on what was chosen
// there. Like Info Pribadi, it reports unsaved edits to the section guard and shows "Perubahan disimpan." after a
// save until the next edit.
export function PreferencesForm({ initialValues, action }: PreferencesFormProps) {
  const akun = useTranslations('dashboard.akun')
  const PREFERENSI = pembeliPreferensi(useTranslations('auth.register'))
  const { jenisBahan, grade, ppi } = PREFERENSI
  const [state, formAction] = useActionState(action, { status: 'idle', values: initialValues })
  // The save result current at the last edit. Edits are unsaved until a later result says "saved".
  const [editedAt, setEditedAt] = useState<PreferencesFormState | null>(null)
  const dirty = editedAt !== null && (editedAt === state || state.status !== 'saved')
  const formRef = useRef<HTMLFormElement>(null)
  const { setDirty, setSaver, reportSave } = useUnsavedChanges()
  const { values } = state
  const markEdited = () => setEditedAt(state)

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

  // Keyed by the saved choice so the uncontrolled chips and the combobox's tags follow a save.
  const savedKey = [values.jenisBahan, values.grade, values.ppiPrioritas].map((list) => list.join()).join('|')

  return (
    <form ref={formRef} action={formAction} onChange={markEdited} className="contents">
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start">
        <h2 className="text-[18px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left lg:[white-space:nowrap]">
          {PREFERENSI.heading.title}
        </h2>
        <p className="text-[14px]/[21px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">{akun('pembeli.preferencesSubtitle')}</p>
      </div>
      <div key={savedKey} className="box-border w-full h-fit shrink-0 flex flex-col gap-[28px] justify-start items-start">
        <PreferenceSection {...jenisBahan.section}>
          <div className="box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-[12px] justify-start items-start">
            {jenisBahan.options.map((option) => (
              <Chip key={option.value} name={jenisBahan.name} {...option} defaultChecked={values.jenisBahan.includes(option.value)} />
            ))}
          </div>
        </PreferenceSection>
        <PreferenceSection {...grade.section}>
          <div className="box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-[16px] justify-start items-stretch sm:items-start">
            {grade.groups.map((group) => (
              <GradeGroup key={group.title} name={grade.name} {...group} defaultValues={values.grade} />
            ))}
          </div>
          <p className="text-[13px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left">{grade.disclaimer}</p>
        </PreferenceSection>
        <PreferenceSection {...ppi.section}>
          <PpiCombobox {...ppi.combobox} defaultIds={values.ppiPrioritas} onSelectionChange={markEdited} />
        </PreferenceSection>
      </div>
      <div className="box-border w-full h-fit shrink-0 flex flex-row flex-wrap lg:flex-nowrap gap-[16px] p-[20px_0px_0px_0px] justify-end items-center [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0]">
        {/* A stable live region, so the result is announced when it appears. */}
        <div role="status" className="box-border [flex:1_1_0] h-fit flex flex-row justify-start items-center">
          {state.status === 'saved' && !dirty && (
            <p className="box-border w-fit h-fit flex flex-row gap-[10px] p-[12px_14px] justify-start items-center bg-[#E8F8F2] rounded-[12px] motion-safe:animate-fade-in">
              <Icon name="circle-check" fill="#17704A" className="box-border w-[18px] shrink-0 h-[18px]" />
              <span className="text-[14px]/[normal] box-border text-[#17704A] font-poppins font-semibold text-left [white-space:nowrap]">
                {akun('saved')}
              </span>
            </p>
          )}
          {state.status === 'error' && (
            <p className="box-border w-fit h-fit flex flex-row gap-[10px] p-[12px_14px] justify-start items-center bg-[#FDECEC] rounded-[12px]">
              <Icon name="circle-alert" fill="#9B2C27" className="box-border w-[18px] shrink-0 h-[18px]" />
              <span className="text-[14px]/[normal] box-border text-[#9B2C27] font-inter font-medium text-left">{state.error}</span>
            </p>
          )}
        </div>
        <SaveButton label={akun('save')} savingLabel={akun('saving')} />
      </div>
    </form>
  )
}
