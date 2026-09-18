import { Icon, type IconName } from '@/components/ui/icon'

export type FormFieldConfig = {
  kind: 'text' | 'select'
  // Also used as the control's name.
  id: string
  label: string
  icon: IconName
  placeholder: string
  required?: boolean
  disabled?: boolean
  // Neutral hint under the control, e.g. why a dependent field is locked.
  helper?: string
  // Replaces the helper with the red error treatment.
  error?: string
}

export type SelectOption = {
  value: string
  label: string
}

// Selects get their options and value from whoever owns the dependent-field logic.
type FormFieldProps = FormFieldConfig & {
  options?: SelectOption[]
  value?: string
  onChange?: (value: string) => void
}

// Control states from the "Form Field States" frame. Focus is the only interactive one, so it lives in CSS.
const CONTROL_STATES = {
  default: 'bg-[#FFFFFF] [border:1px_solid_#7F8FA4] focus-within:[border:2px_solid_#168BE5]',
  error: 'bg-[#FFFFFF] [border:1.5px_solid_#E25B55]',
  disabled: 'bg-[#F7F9FC] [border:1px_solid_#E2E8F0]',
}

const VALUE_CLASSES =
  'text-[15px]/[normal] box-border [flex:1_1_0] min-w-0 self-stretch bg-transparent outline-none font-inter font-normal text-left'

export function FormField({
  kind,
  id,
  label,
  icon,
  placeholder,
  required,
  disabled,
  helper,
  error,
  options = [],
  value,
  onChange,
}: FormFieldProps) {
  const state = disabled ? 'disabled' : error ? 'error' : 'default'
  const mutedFill = disabled ? '#94A3B8' : '#5B6B7C'
  const message = error ?? helper
  const messageId = message ? `${id}-message` : undefined

  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start">
      <label htmlFor={id} className="box-border w-fit h-fit shrink-0 flex flex-row gap-[4px] justify-start items-center">
        <span className="text-[15px]/[normal] box-border text-[#0B3B5C] font-inter font-semibold text-left [white-space:nowrap]">
          {label}
        </span>
        {required && (
          <span
            aria-hidden="true"
            className="text-[15px]/[normal] box-border text-[#C23B35] font-inter font-semibold text-left [white-space:nowrap]"
          >
            *
          </span>
        )}
      </label>
      <div
        className={`box-border w-full h-[52px] shrink-0 flex flex-row gap-[12px] p-[0px_16px] justify-start items-center ${CONTROL_STATES[state]} rounded-[12px]`}
      >
        <Icon name={icon} fill={mutedFill} className="box-border w-[20px] shrink-0 h-[20px]" />
        {kind === 'text' ? (
          <input
            id={id}
            name={id}
            type="text"
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={messageId}
            className={`${VALUE_CLASSES} text-[#0B3B5C] placeholder:text-[#5B6B7C] disabled:text-[#94A3B8] disabled:placeholder:text-[#94A3B8]`}
          />
        ) : (
          <>
            {/* The empty placeholder option keeps a required select :invalid, which is what greys its text. */}
            <select
              id={id}
              name={id}
              value={value ?? ''}
              onChange={(event) => onChange?.(event.target.value)}
              required={required}
              disabled={disabled}
              aria-invalid={error ? true : undefined}
              aria-describedby={messageId}
              className={`${VALUE_CLASSES} appearance-none cursor-pointer disabled:cursor-not-allowed text-[#0B3B5C] invalid:text-[#5B6B7C] disabled:text-[#94A3B8]`}
            >
              <option value="" disabled>
                {placeholder}
              </option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Icon name="chevron-down" fill={mutedFill} className="box-border w-[20px] shrink-0 h-[20px] pointer-events-none" />
          </>
        )}
      </div>
      {message && (
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center">
          {error && <Icon name="circle-alert" fill="#C23B35" className="box-border w-[16px] shrink-0 h-[16px]" />}
          <p
            id={messageId}
            className={`text-[13px]/[19px] box-border [flex:1_1_0] ${error ? 'text-[#C23B35]' : 'text-[#5B6B7C]'} font-inter font-normal text-left`}
          >
            {message}
          </p>
        </div>
      )}
    </div>
  )
}
