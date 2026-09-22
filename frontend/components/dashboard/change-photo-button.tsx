'use client'

import { useRef, useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Icon, type IconName } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER, PRESS } from '@/components/ui/interaction'
import { PhotoEditor } from '@/components/dashboard/photo-editor'
import { DEFAULT_CROP, encodeSource, renderAvatar, type AvatarCrop } from '@/lib/photo/avatar-crop'
import type { CurrentAvatar } from '@/lib/supabase/avatar'
import { changeProfilePhoto } from '@/app/profile-actions'

type Editing = {
  image: ImageBitmap
  crop: AvatarCrop
  // A newly chosen photo is uploaded as the new original too; re-adjusting keeps the saved one.
  isNew: boolean
}

type Message = { tone: 'ok' | 'error'; text: string }

// "Ubah foto" picks a new picture and "Atur foto" reopens the saved one (its uncropped original, where the current
// position was set). Either way the photo editor opens first, and only "Simpan foto" uploads. The page re-renders with
// the new photo (the action revalidates the dashboards); the status line under the buttons says how it went.
export function ChangePhotoButton({ photo }: { photo: CurrentAvatar | null }) {
  const t = useTranslations('dashboard.akun')
  const inputRef = useRef<HTMLInputElement>(null)
  const [editing, setEditing] = useState<Editing | null>(null)
  const [opening, setOpening] = useState(false)
  const [saving, startSaving] = useTransition()
  const [saveError, setSaveError] = useState<string | null>(null)
  const [message, setMessage] = useState<Message | null>(null)

  const open = (image: ImageBitmap, crop: AvatarCrop, isNew: boolean) => {
    setSaveError(null)
    setEditing({ image, crop, isNew })
  }

  const close = () => {
    editing?.image.close()
    setEditing(null)
  }

  const pickFile = async (file: File) => {
    setMessage(null)
    try {
      // from-image: phone photos rotated through EXIF come out upright. HEIC fails here in most browsers.
      open(await createImageBitmap(file, { imageOrientation: 'from-image' }), DEFAULT_CROP, true)
    } catch {
      setMessage({ tone: 'error', text: t('changePhotoInvalid') })
    }
  }

  const adjustSaved = async () => {
    if (!photo) return
    setMessage(null)
    setOpening(true)
    try {
      const response = await fetch(photo.sourceUrl)
      if (!response.ok) throw new Error(String(response.status))
      open(await createImageBitmap(await response.blob()), photo.crop ?? DEFAULT_CROP, false)
    } catch {
      setMessage({ tone: 'error', text: t('adjustPhotoFailed') })
    } finally {
      setOpening(false)
    }
  }

  const save = (crop: AvatarCrop) => {
    if (!editing) return
    setSaveError(null)
    startSaving(async () => {
      const form = new FormData()
      try {
        form.append('foto', await renderAvatar(editing.image, crop), 'avatar.jpg')
        if (editing.isNew) form.append('sumber', await encodeSource(editing.image), 'source.jpg')
      } catch {
        setSaveError(t('changePhotoFailed'))
        return
      }
      form.append('crop', JSON.stringify(crop))
      const result = await changeProfilePhoto(form)
      if (result.status === 'saved') {
        close()
        setMessage({ tone: 'ok', text: t('changePhotoSaved') })
      } else {
        setSaveError(result.reason === 'invalid' ? t('changePhotoInvalid') : t('changePhotoFailed'))
      }
    })
  }

  const busy = opening || saving

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
          if (file) void pickFile(file)
        }}
      />
      <div className="box-border w-full sm:w-fit h-fit flex flex-row flex-wrap gap-[8px] justify-stretch sm:justify-end items-center">
        {photo && (
          <PhotoButton
            icon={opening ? 'loader-circle' : 'sliders-horizontal'}
            spinning={opening}
            label={opening ? t('adjustPhotoPending') : t('adjustPhoto')}
            disabled={busy}
            describedBy={message ? 'change-photo-status' : undefined}
            onClick={() => void adjustSaved()}
          />
        )}
        <PhotoButton
          icon="camera"
          label={t('changePhoto')}
          disabled={busy}
          describedBy={message ? 'change-photo-status' : undefined}
          onClick={() => inputRef.current?.click()}
        />
      </div>
      {/* Always in the page (so screen readers announce it as it changes), taking no room while empty. */}
      <p
        id="change-photo-status"
        role="status"
        className={`text-[13px]/[18px] box-border mt-[6px] empty:mt-0 ${message?.tone === 'error' ? 'text-[#C23B35]' : 'text-[#17704A]'} font-inter font-medium text-left sm:text-right`}
      >
        {message?.text}
      </p>
      {editing && (
        <PhotoEditor
          image={editing.image}
          initialCrop={editing.crop}
          saving={saving}
          error={saveError}
          onCancel={close}
          onSave={save}
        />
      )}
    </div>
  )
}

function PhotoButton({
  icon,
  spinning = false,
  label,
  disabled,
  describedBy,
  onClick,
}: {
  icon: IconName
  spinning?: boolean
  label: string
  disabled: boolean
  describedBy?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-describedby={describedBy}
      onClick={onClick}
      className={`box-border [flex:1_1_auto] sm:flex-none w-fit shrink-0 h-fit min-h-[44px] lg:min-h-auto flex flex-row gap-[12px] p-[11px_20px] justify-center items-center bg-[#FFFFFF] [outline:1.5px_solid_#0F6CB8] [outline-offset:-0.75px] rounded-[999px] cursor-pointer disabled:cursor-wait disabled:opacity-70 ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`}
    >
      <span className="text-[14px]/[normal] box-border text-[#0F6CB8] font-poppins font-semibold text-left [white-space:nowrap]">{label}</span>
      <Icon name={icon} fill="#0F6CB8" className={`box-border w-[18px] shrink-0 h-[18px] ${spinning ? 'motion-safe:animate-spin' : ''}`} />
    </button>
  )
}
