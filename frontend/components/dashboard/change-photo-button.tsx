'use client'

import { useRef, useState, useTransition } from 'react'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER, PRESS } from '@/components/ui/interaction'
import { prepareUpload } from '@/lib/photo/prepare-upload'
import { changeProfilePhoto } from '@/app/profile-actions'

export type ChangePhotoCopy = {
  label: string
  pending: string
  saved: string
  invalid: string
  failed: string
}

// Profile photos only ever show as small circles, so a 512px JPEG is plenty and uploads quickly on a phone.
const AVATAR_EDGE = 512

// "Ubah foto": opens the file picker, shrinks the picture in the browser, and saves it. The page re-renders with the
// new photo (the action revalidates the dashboards); the status line under the button says how it went.
export function ChangePhotoButton({ copy }: { copy: ChangePhotoCopy }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null)

  const upload = (file: File) => {
    setMessage(null)
    startTransition(async () => {
      if (!file.type.startsWith('image/')) {
        setMessage({ tone: 'error', text: copy.invalid })
        return
      }
      const form = new FormData()
      form.append('foto', await prepareUpload(file, AVATAR_EDGE), 'avatar.jpg')
      const result = await changeProfilePhoto(form)
      if (result.status === 'saved') setMessage({ tone: 'ok', text: copy.saved })
      else setMessage({ tone: 'error', text: result.reason === 'invalid' ? copy.invalid : copy.failed })
    })
  }

  return (
    <div className="box-border w-full sm:w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-stretch sm:items-end">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const file = event.target.files?.[0]
          // Cleared so choosing the same file again still fires onChange.
          event.target.value = ''
          if (file) upload(file)
        }}
      />
      <button
        type="button"
        disabled={pending}
        aria-describedby={message ? 'change-photo-status' : undefined}
        onClick={() => inputRef.current?.click()}
        className={`box-border w-full sm:w-fit shrink-0 h-fit min-h-[44px] lg:min-h-auto flex flex-row gap-[12px] p-[11px_20px] justify-center items-center bg-[#FFFFFF] [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] rounded-[999px] cursor-pointer disabled:cursor-wait disabled:opacity-70 ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`}
      >
        <span className="text-[14px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">
          {pending ? copy.pending : copy.label}
        </span>
        <Icon
          name={pending ? 'loader-circle' : 'camera'}
          fill="#0F6CB8"
          className={`box-border w-[18px] shrink-0 h-[18px] ${pending ? 'motion-safe:animate-spin' : ''}`}
        />
      </button>
      {/* Always in the page (so screen readers announce it as it changes), taking no room while empty. */}
      <p
        id="change-photo-status"
        role="status"
        className={`text-[13px]/[18px] box-border mt-[6px] empty:mt-0 ${message?.tone === 'error' ? 'text-[#C23B35]' : 'text-[#17704A]'} font-inter font-medium text-left sm:text-right`}
      >
        {message?.text}
      </p>
    </div>
  )
}
