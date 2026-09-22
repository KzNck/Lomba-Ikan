'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { useFormatter } from 'next-intl'

// Nine digits is under a billion rupiah per kg, far past any real price, and keeps the number exact.
const MAX_DIGITS = 9

type RupiahInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type'> & {
  name: string
  defaultValue: string
}

const digitsOf = (value: string) => value.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, MAX_DIGITS)

// The "Harga Jual" input: groups thousands as the fisher types ("10000" reads "10.000" in Indonesian), with the caret
// kept after the same digit. The form still submits the formatted text; the server actions keep only the digits.
export function RupiahInput({ defaultValue, ...props }: RupiahInputProps) {
  const format = useFormatter()
  const group = (digits: string) => (digits ? format.number(Number(digits), { useGrouping: true, maximumFractionDigits: 0 }) : '')
  const [value, setValue] = useState(() => group(digitsOf(defaultValue)))
  const ref = useRef<HTMLInputElement>(null)
  // Digits left of the caret after the last edit, so the caret can be put back once separators move.
  const caretDigits = useRef<number | null>(null)

  useLayoutEffect(() => {
    const input = ref.current
    const wanted = caretDigits.current
    if (!input || wanted === null || document.activeElement !== input) return
    caretDigits.current = null
    let position = 0
    for (let seen = 0; position < value.length && seen < wanted; position++) {
      if (/\d/.test(value[position])) seen++
    }
    input.setSelectionRange(position, position)
  }, [value])

  return (
    <input
      {...props}
      ref={ref}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={value}
      onChange={(event) => {
        const text = event.target.value
        const caret = event.target.selectionStart ?? text.length
        caretDigits.current = digitsOf(text.slice(0, caret)).length
        setValue(group(digitsOf(text)))
      }}
    />
  )
}
