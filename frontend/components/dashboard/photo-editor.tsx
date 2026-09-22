'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Icon } from '@/components/ui/icon'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { OUTLINE_HOVER, PRESS, SOLID_HOVER } from '@/components/ui/interaction'
import { clampCrop, DEFAULT_CROP, drawCrop, MAX_ZOOM, type AvatarCrop, type Rotation } from '@/lib/photo/avatar-crop'

type PhotoEditorProps = {
  image: ImageBitmap
  initialCrop: AvatarCrop
  saving: boolean
  // Shown above the buttons when saving failed; the editor stays open so the adjustments aren't lost.
  error: string | null
  onCancel: () => void
  onSave: (crop: AvatarCrop) => void
}

// The circle's side on screen. Positions are stored relative to it (lib/photo/avatar-crop.ts), so the 512px upload
// matches what this shows.
const VIEW = 256
// One arrow press moves the photo this share of the circle; Shift moves it four times as far.
const NUDGE = 0.02
const ZOOM_STEP = 0.1

// "Atur foto profil": a modal <dialog> (showModal makes the page inert, traps focus and turns Escape into `cancel`).
// The photo is drawn on a canvas under a circular mask; drag it (pointer, finger, or arrow keys) to move it, and zoom
// with the slider, the wheel, or +/−. Moves stop where the photo would stop covering the circle.
export function PhotoEditor({ image, initialCrop, saving, error, onCancel, onSave }: PhotoEditorProps) {
  const t = useTranslations('dashboard.akun.photoEditor')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const areaRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ id: number; x: number; y: number } | null>(null)
  const titleId = useId()
  const descriptionId = useId()
  const zoomId = useId()

  const fit = (next: AvatarCrop) => clampCrop(next, image.width, image.height)
  const [crop, setCrop] = useState(() => fit(initialCrop))
  const update = (change: (current: AvatarCrop) => AvatarCrop) => setCrop((current) => fit(change(current)))

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
    return () => dialog?.close()
  }, [])

  // Redrawn at the screen's pixel density so the preview stays sharp.
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const ratio = window.devicePixelRatio || 1
    canvas.width = Math.round(VIEW * ratio)
    canvas.height = Math.round(VIEW * ratio)
    drawCrop(context, image, canvas.width, crop)
  }, [image, crop])

  // A native listener: React's wheel handler is passive, so it couldn't stop the page behind from scrolling.
  useEffect(() => {
    const area = areaRef.current
    if (!area) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      setCrop((current) => clampCrop({ ...current, zoom: current.zoom * Math.exp(-event.deltaY * 0.002) }, image.width, image.height))
    }
    area.addEventListener('wheel', onWheel, { passive: false })
    return () => area.removeEventListener('wheel', onWheel)
  }, [image])

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = event.shiftKey ? NUDGE * 4 : NUDGE
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }
    const move = moves[event.key]
    if (move) update((c) => ({ ...c, x: c.x + move[0], y: c.y + move[1] }))
    else if (event.key === '+' || event.key === '=') update((c) => ({ ...c, zoom: c.zoom + ZOOM_STEP }))
    else if (event.key === '-' || event.key === '_') update((c) => ({ ...c, zoom: c.zoom - ZOOM_STEP }))
    else return
    event.preventDefault()
  }

  const secondaryButton = `box-border w-fit shrink-0 h-[40px] flex flex-row gap-[8px] p-[0px_14px] justify-center items-center bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[999px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${OUTLINE_HOVER} ${PRESS} ${FOCUS_RING}`
  const iconButton = `box-border w-[40px] shrink-0 h-[40px] flex flex-row justify-center items-center rounded-[999px] cursor-pointer disabled:opacity-40 ${OUTLINE_HOVER} ${FOCUS_RING}`

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault()
        if (!saving) onCancel()
      }}
      className="box-border w-[calc(100%_-_24px)] max-w-[400px] max-h-none m-auto p-0 border-0 bg-transparent overflow-visible overscroll-contain backdrop:bg-[#0B3B5CA6]"
    >
      <div className="box-border w-full h-fit flex flex-col gap-[20px] p-[20px] sm:p-[24px] justify-start items-stretch bg-[#FFFFFF] rounded-[20px] [box-shadow:0px_24px_48px_0px_#0B3B5C3D] motion-safe:animate-fade-up">
        <div className="box-border w-full h-fit flex flex-col gap-[6px] justify-start items-start">
          <h2 id={titleId} className="text-[18px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left">
            {t('title')}
          </h2>
          <p id={descriptionId} className="text-[14px]/[20px] box-border text-[#5B6B7C] font-inter font-normal text-left text-pretty">
            {t('description')}
          </p>
        </div>

        {/* The dark ring outside the circle is a huge spread shadow on the circle itself, clipped by the square. */}
        <div
          ref={areaRef}
          role="group"
          tabIndex={0}
          aria-label={t('area')}
          onKeyDown={onKeyDown}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId)
            drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
          }}
          onPointerMove={(event) => {
            const start = drag.current
            if (!start || start.id !== event.pointerId) return
            const dx = (event.clientX - start.x) / VIEW
            const dy = (event.clientY - start.y) / VIEW
            drag.current = { ...start, x: event.clientX, y: event.clientY }
            update((c) => ({ ...c, x: c.x + dx, y: c.y + dy }))
          }}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
          className={`box-border w-[256px] h-[256px] shrink-0 self-center relative overflow-hidden rounded-[16px] bg-[#F7F9FC] touch-none select-none cursor-grab active:cursor-grabbing ${FOCUS_RING}`}
        >
          <canvas ref={canvasRef} aria-hidden="true" className="box-border w-[256px] h-[256px] block" />
          <div
            aria-hidden="true"
            className="box-border absolute inset-0 rounded-[999px] [box-shadow:0px_0px_0px_9999px_#0B3B5C8C] [outline:2px_solid_#FFFFFFCC] [outline-offset:-1px] pointer-events-none"
          />
        </div>

        <div className="box-border w-full h-fit flex flex-row gap-[4px] justify-start items-center">
          <label htmlFor={zoomId} className="sr-only">
            {t('zoom')}
          </label>
          <button
            type="button"
            aria-label={t('zoomOut')}
            disabled={crop.zoom <= 1}
            onClick={() => update((c) => ({ ...c, zoom: c.zoom - ZOOM_STEP * 2 }))}
            className={iconButton}
          >
            <Icon name="minus" fill="#0B3B5C" className="box-border w-[18px] h-[18px]" />
          </button>
          <input
            id={zoomId}
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={crop.zoom}
            aria-valuetext={`${Math.round(crop.zoom * 100)}%`}
            onChange={(event) => update((c) => ({ ...c, zoom: Number(event.target.value) }))}
            className="box-border [flex:1_1_0] min-w-0 h-[40px] cursor-pointer accent-[#0F6CB8]"
          />
          <button
            type="button"
            aria-label={t('zoomIn')}
            disabled={crop.zoom >= MAX_ZOOM}
            onClick={() => update((c) => ({ ...c, zoom: c.zoom + ZOOM_STEP * 2 }))}
            className={iconButton}
          >
            <Icon name="plus" fill="#0B3B5C" className="box-border w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="box-border w-full h-fit flex flex-row flex-wrap gap-[8px] justify-start items-center">
          <button
            type="button"
            onClick={() => update((c) => ({ ...c, rotation: ((c.rotation + 270) % 360) as Rotation }))}
            className={secondaryButton}
          >
            <Icon name="rotate-ccw" fill="#0B3B5C" className="box-border w-[16px] h-[16px]" />
            <span className="text-[14px]/[normal] text-[#0B3B5C] font-inter font-semibold [white-space:nowrap]">{t('rotate')}</span>
          </button>
          <button type="button" onClick={() => setCrop(fit(DEFAULT_CROP))} className={secondaryButton}>
            <span className="text-[14px]/[normal] text-[#0B3B5C] font-inter font-semibold [white-space:nowrap]">{t('reset')}</span>
          </button>
        </div>

        <p role="alert" className="text-[13px]/[18px] box-border text-[#C23B35] font-inter font-medium text-left empty:hidden">
          {error}
        </p>

        <div className="box-border w-full h-fit flex flex-row gap-[10px] pt-[4px] justify-end items-center">
          <button type="button" disabled={saving} onClick={onCancel} className={secondaryButton}>
            <span className="text-[14px]/[normal] text-[#0B3B5C] font-inter font-semibold [white-space:nowrap]">{t('cancel')}</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(crop)}
            className={`box-border w-fit shrink-0 h-[40px] flex flex-row gap-[8px] p-[0px_18px] justify-center items-center bg-[#0F6CB8] rounded-[999px] cursor-pointer disabled:cursor-wait disabled:opacity-70 ${SOLID_HOVER} ${PRESS} ${FOCUS_RING}`}
          >
            {saving && <Icon name="loader-circle" fill="#FFFFFF" className="box-border w-[16px] h-[16px] motion-safe:animate-spin" />}
            <span className="text-[14px]/[normal] text-[#FFFFFF] font-inter font-semibold [white-space:nowrap]">
              {saving ? t('saving') : t('save')}
            </span>
          </button>
        </div>
      </div>
    </dialog>
  )
}
