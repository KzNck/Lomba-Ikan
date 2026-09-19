import { RegisterLayout } from '@/components/register/register-layout'
import { FormCard } from '@/components/register/form-card'
import { FormField } from '@/components/register/form-field'
import { LocationFields } from '@/components/register/location-fields'
import { InfoCallout } from '@/components/register/info-callout'
import { SubmitButton } from '@/components/register/submit-button'
import { NELAYAN_PROFILE } from '@/components/register/content'
import { enterNelayanDashboard } from '@/app/nelayan/actions'

export default function RegisterNelayanPage() {
  return (
    <RegisterLayout kind="form" currentStep={1} heading={NELAYAN_PROFILE.heading}>
      <FormCard {...NELAYAN_PROFILE.card} action={enterNelayanDashboard}>
        <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[24px] justify-start items-start">
          <FormField {...NELAYAN_PROFILE.nameField} />
          <LocationFields {...NELAYAN_PROFILE.location} />
        </div>
        <InfoCallout {...NELAYAN_PROFILE.missingPpi} />
        <SubmitButton label={NELAYAN_PROFILE.submitLabel} />
      </FormCard>
    </RegisterLayout>
  )
}
