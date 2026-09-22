'use client'

import { useActionState, useState } from 'react'
import { useTranslations } from 'next-intl'
import { RegisterLayout } from '@/components/register/register-layout'
import { FormCard } from '@/components/register/form-card'
import { FormField } from '@/components/register/form-field'
import { ChipGroup } from '@/components/register/chip-group'
import { Chip } from '@/components/register/chip'
import { PreferenceSection } from '@/components/register/preference-section'
import { GradeGroup } from '@/components/register/grade-group'
import { PpiCombobox } from '@/components/register/ppi-combobox'
import { FormCardFooter } from '@/components/register/form-card-footer'
import { SubStepProgress } from '@/components/register/sub-step-progress'
import { SubmitButton } from '@/components/register/submit-button'
import { BackButton } from '@/components/register/back-button'
import { FormError } from '@/components/login/form-error'
import { useErrorFocus } from '@/components/login/use-error-focus'
import { pembeliPreferensi, pembeliUsaha } from '@/components/register/content'
import { registerPembeli, type AuthFormState } from '@/app/auth/actions'

// The two parts are separate <form>s, so part 1's answers are copied into part 2
// as hidden inputs — the account is created from a single submit at the end.
type BusinessInfo = [name: string, value: string][]

// Both parts stay mounted and the inactive one is hidden, so going back keeps what was entered.
export function PembeliRegistration() {
  const t = useTranslations('auth.register')
  const usaha = pembeliUsaha(t)
  const preferensi = pembeliPreferensi(t)
  const { jenisUsaha } = usaha
  const { jenisBahan, grade, ppi } = preferensi
  const [part, setPart] = useState<1 | 2>(1)
  const [jenisUsahaError, setJenisUsahaError] = useState(false)
  const [business, setBusiness] = useState<BusinessInfo>([])
  const [state, action, pending] = useActionState<AuthFormState, FormData>(registerPembeli, {})
  useErrorFocus(state)

  const showPart = (next: 1 | 2) => {
    setPart(next)
    window.scrollTo({ top: 0 })
  }

  // The browser has already checked the required text fields; a checkbox group needs checking by hand.
  const continueToPreferences = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const entries = new FormData(event.currentTarget)
    if (entries.getAll(jenisUsaha.id).length === 0) {
      setJenisUsahaError(true)
      event.currentTarget.querySelector<HTMLInputElement>(`input[name="${jenisUsaha.id}"]`)?.focus()
      return
    }
    setBusiness([...entries.entries()].map(([name, value]) => [name, String(value)]))
    showPart(2)
  }

  return (
    <RegisterLayout
      kind="form"
      currentStep={1}
      heading={part === 1 ? usaha.heading : preferensi.heading}
    >
      <FormCard
        {...usaha.card}
        size="lg"
        hidden={part !== 1}
        onSubmit={continueToPreferences}
        onChange={(event) => {
          const target = event.target as HTMLInputElement
          if (target.name === jenisUsaha.id && target.checked) setJenisUsahaError(false)
        }}
      >
        <div className="box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-[20px] sm:gap-[24px] justify-start items-stretch sm:items-start">
          {usaha.nameFields.map((field) => (
            <FormField key={field.id} {...field} grow />
          ))}
        </div>
        <FormField {...usaha.emailField} defaultValue={state.email} />
        <div className="box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-[20px] sm:gap-[24px] justify-start items-stretch sm:items-start">
          {usaha.passwordFields.map((field) => (
            <FormField key={field.id} {...field} grow />
          ))}
        </div>
        <ChipGroup {...jenisUsaha} error={jenisUsahaError ? usaha.jenisUsahaError : undefined} />
        <FormCardFooter>
          <SubStepProgress {...usaha.progress} />
          <SubmitButton label={usaha.submitLabel} icon="arrow-right" inline />
        </FormCardFooter>
      </FormCard>

      <FormCard {...preferensi.card} size="lg" hidden={part !== 2} action={action}>
        {business.map(([name, value], index) => (
          <input key={`${name}-${index}`} type="hidden" name={name} value={value} />
        ))}
        <PreferenceSection {...jenisBahan.section}>
          <div className="box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-[12px] justify-start items-start">
            {jenisBahan.options.map((option) => (
              <Chip key={option.value} name={jenisBahan.name} {...option} />
            ))}
          </div>
        </PreferenceSection>
        <PreferenceSection {...grade.section}>
          <div className="box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-[16px] justify-start items-stretch sm:items-start">
            {grade.groups.map((group) => (
              <GradeGroup key={group.title} name={grade.name} {...group} />
            ))}
          </div>
          <p className="text-[13px]/[normal] box-border text-[#5B6B7C] font-inter font-normal text-left lg:[white-space:nowrap]">
            {grade.disclaimer}
          </p>
        </PreferenceSection>
        <PreferenceSection {...ppi.section}>
          <PpiCombobox {...ppi.combobox} />
        </PreferenceSection>
        {/* Registers without preferences: the action drops them when this name is present,
            so ticking a few boxes and then skipping does what the label says. */}
        <button
          type="submit"
          name="lewati"
          value="1"
          className="box-border w-fit h-fit min-h-[44px] lg:min-h-auto shrink-0 flex flex-row gap-0 p-[4px_0px] justify-start items-center lg:items-start cursor-pointer"
        >
          <span className="text-[14px]/[normal] box-border text-[#0F6CB8] font-inter font-semibold text-left [white-space:nowrap] underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-200 ease-out hover:decoration-current">
            {preferensi.skipLabel}
          </span>
        </button>
        <FormError message={state.error} />
        <FormCardFooter>
          <SubStepProgress {...preferensi.progress} />
          <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-center">
            <BackButton label={preferensi.backLabel} onClick={() => showPart(1)} />
            <SubmitButton
              label={pending ? preferensi.submittingLabel : preferensi.submitLabel}
              icon="check"
              inline
              disabled={pending}
            />
          </div>
        </FormCardFooter>
      </FormCard>
    </RegisterLayout>
  )
}
