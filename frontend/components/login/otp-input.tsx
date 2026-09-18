'use client'

import { useId, useRef, useState } from 'react'

type OtpInputProps = {
  // Name of the hidden input that submits the joined code.
  name: string
  label: string
  length: number
  // "{n}" and "{total}" are replaced per box, e.g. "Digit 1 dari 6".
  digitLabel: string
  // Rendered under the boxes, e.g. the resend countdown.
  children?: React.ReactNode
}

// One box per digit: typing advances, Backspace on an empty box steps back, and pasting a code fills the row.
export function OtpInput({ name, label, length, digitLabel, children }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(''))
  const boxes = useRef<(HTMLInputElement | null)[]>([])
  const labelId = useId()

  const focusBox = (index: number) => boxes.current[Math.max(0, Math.min(length - 1, index))]?.focus()

  // Writes digits starting at `start` and returns the index after the last one written.
  const fill = (start: number, value: string) => {
    const incoming = value.replace(/\D/g, '').slice(0, length - start).split('')
    setDigits((current) => current.map((digit, index) => incoming[index - start] ?? digit))
    return start + incoming.length
  }

  return (
    <div role="group" aria-labelledby={labelId} className="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start">
      <span id={labelId} className="text-[15px]/[normal] box-border text-[#0B3B5C] font-inter font-semibold text-left [white-space:nowrap]">
        {label}
      </span>
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-start">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              boxes.current[index] = element
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={digitLabel.replace('{n}', String(index + 1)).replace('{total}', String(length))}
            required
            value={digit}
            onChange={(event) => {
              const typed = event.target.value.replace(/\D/g, '')
              if (!typed) {
                setDigits((current) => current.map((d, i) => (i === index ? '' : d)))
                return
              }
              // A keystroke into a filled box arrives as two characters (keep the new one); autofill brings the whole code.
              const next = fill(index, typed.length <= 2 ? typed.slice(-1) : typed)
              focusBox(next)
            }}
            onPaste={(event) => {
              event.preventDefault()
              focusBox(fill(index, event.clipboardData.getData('text')))
            }}
            onKeyDown={(event) => {
              if (event.key === 'Backspace' && !digit) {
                event.preventDefault()
                setDigits((current) => current.map((d, i) => (i === index - 1 ? '' : d)))
                focusBox(index - 1)
              } else if (event.key === 'ArrowLeft') {
                focusBox(index - 1)
              } else if (event.key === 'ArrowRight') {
                focusBox(index + 1)
              }
            }}
            className="box-border [flex:1_1_0] min-w-0 h-[64px] bg-[#FFFFFF] [border:1px_solid_#7F8FA4] focus:[border:2px_solid_#0F6CB8] rounded-[12px] outline-none text-center text-[24px]/[normal] text-[#0B3B5C] caret-[#0F6CB8] font-poppins font-semibold"
          />
        ))}
      </div>
      {children}
      <input type="hidden" name={name} value={digits.join('')} />
    </div>
  )
}
