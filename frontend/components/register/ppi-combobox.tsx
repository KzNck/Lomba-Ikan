'use client'

import { useId, useState } from 'react'
import { Icon } from '@/components/ui/icon'
import { getLokasiPelabuhan, getPelabuhanById, searchPelabuhan, type Pelabuhan } from '@/lib/wilayah'

export type PpiComboboxContent = {
  // Name of the hidden inputs that submit the chosen ports' ids.
  name: string
  label: string
  placeholder: string
  // "{query}" is replaced with what the user typed.
  emptyTitle: string
  emptyHint: string
  missingPpi: {
    label: string
    href: string
  }
  // "{nama}" is replaced with the port's name.
  removeLabel: string
}

// Closed vs open from the "PPI combobox" states; focus-within covers an Escape-closed but still focused input.
const CONTROL_STATES = {
  closed: 'gap-[12px] bg-[#FFFFFF] [border:1px_solid_#7F8FA4] focus-within:[border:2px_solid_#0F6CB8]',
  open: 'gap-[10px] bg-[#FFFFFF] [border:2px_solid_#0F6CB8]',
}

type PpiComboboxProps = PpiComboboxContent & {
  // Ports that start chosen, by id (the account's saved preference).
  defaultIds?: string[]
  // Called when a port is added or removed: the tags aren't form fields, so the form's own change events miss it.
  onSelectionChange?: () => void
}

// Searchable multi-select over every registered port. Chosen ports show as removable tags below.
export function PpiCombobox({
  name,
  label,
  placeholder,
  emptyTitle,
  emptyHint,
  missingPpi,
  removeLabel,
  defaultIds = [],
  onSelectionChange,
}: PpiComboboxProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selected, setSelected] = useState<Pelabuhan[]>(() =>
    defaultIds.map((id) => getPelabuhanById(id)).filter((pelabuhan): pelabuhan is Pelabuhan => pelabuhan !== undefined),
  )
  const listboxId = useId()

  const results = searchPelabuhan(query)
  const optionId = (index: number) => `${listboxId}-${index}`
  const isSelected = (pelabuhan: Pelabuhan) => selected.some((p) => p.id === pelabuhan.id)

  const toggle = (pelabuhan: Pelabuhan) => {
    setSelected((current) =>
      current.some((p) => p.id === pelabuhan.id)
        ? current.filter((p) => p.id !== pelabuhan.id)
        : [...current, pelabuhan],
    )
    onSelectionChange?.()
  }

  const moveActive = (index: number) => {
    setActiveIndex(index)
    document.getElementById(optionId(index))?.scrollIntoView({ block: 'nearest' })
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) return setOpen(true)
      if (results.length === 0) return
      const step = event.key === 'ArrowDown' ? 1 : -1
      moveActive((activeIndex + step + results.length) % results.length)
    } else if (event.key === 'Enter') {
      // A search box never submits the form: open, Enter picks the active option;
      // closed, it does nothing rather than firing whichever submit button is first.
      event.preventDefault()
      if (open && results[activeIndex]) toggle(results[activeIndex])
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <>
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start relative">
        <div
          className={`box-border w-full h-[52px] shrink-0 flex flex-row p-[0px_16px] justify-start items-center ${CONTROL_STATES[open ? 'open' : 'closed']} rounded-[12px]`}
        >
          <Icon name="search" fill="#5B6B7C" className="box-border w-[20px] shrink-0 h-[20px]" />
          <input
            type="text"
            role="combobox"
            aria-label={label}
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={open && results.length > 0 ? optionId(activeIndex) : undefined}
            autoComplete="off"
            placeholder={placeholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={onKeyDown}
            className="text-[16px]/[normal] lg:text-[15px]/[normal] box-border [flex:1_1_0] min-w-0 self-stretch bg-transparent outline-none text-[#0B3B5C] placeholder:text-[#5B6B7C] font-inter font-normal text-left"
          />
          <Icon
            name={open ? 'chevron-up' : 'chevron-down'}
            fill="#5B6B7C"
            className="box-border w-[20px] shrink-0 h-[20px] pointer-events-none"
          />
        </div>
        {open && (
          // Mousedown is cancelled so picking an option (or dragging the scrollbar) doesn't blur the input.
          // The export has no scroll limit; with 686 ports the list is capped and scrolls.
          <div
            onMouseDown={(event) => event.preventDefault()}
            className="box-border w-full h-fit shrink-0 [box-shadow:0px_8px_24px_0px_#0B3B5C1A] flex flex-col gap-[2px] p-[6px] justify-start items-start bg-[#FFFFFF] [outline:1px_solid_#E2E8F0] [outline-offset:-0.5px] rounded-[12px] absolute left-0 top-[calc(100%+8px)] z-10 max-h-[320px] overflow-y-auto"
          >
            {results.length > 0 ? (
              <ul
                id={listboxId}
                role="listbox"
                aria-label={label}
                aria-multiselectable="true"
                className="box-border w-full h-fit shrink-0 flex flex-col gap-[2px] justify-start items-start"
              >
                {results.map((pelabuhan, index) => {
                  const chosen = isSelected(pelabuhan)

                  return (
                    <li
                      key={pelabuhan.id}
                      id={optionId(index)}
                      role="option"
                      aria-selected={chosen}
                      onClick={() => toggle(pelabuhan)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[10px_12px] justify-start items-center ${index === activeIndex ? 'bg-[#F3FAFF]' : ''} hover:bg-[#F3FAFF] transition-colors duration-150 ease-out rounded-[8px] cursor-pointer`}
                    >
                      <span className="box-border w-[16px] shrink-0 h-[16px] flex flex-row gap-0 justify-start items-start">
                        {chosen && <Icon name="check" fill="#0F6CB8" className="box-border w-[16px] shrink-0 h-[16px]" />}
                      </span>
                      <span className="box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[2px] justify-start items-start">
                        <span
                          className={`text-[14px]/[normal] box-border text-[#0B3B5C] font-inter ${chosen ? 'font-semibold' : 'font-medium'} text-left [white-space:nowrap]`}
                        >
                          {pelabuhan.nama}
                        </span>
                        <span className="text-[13px]/[normal] box-border max-w-full truncate text-[#5B6B7C] font-inter font-normal text-left">
                          {getLokasiPelabuhan(pelabuhan)}
                        </span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <>
                <div
                  id={listboxId}
                  role="status"
                  className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] p-[10px_12px] justify-start items-start"
                >
                  <p className="text-[14px]/[20px] box-border w-full text-[#0B3B5C] font-inter font-semibold text-left">
                    {emptyTitle.replace('{query}', query.trim())}
                  </p>
                  <p className="text-[13px]/[19px] box-border w-full text-[#5B6B7C] font-inter font-normal text-left">
                    {emptyHint}
                  </p>
                </div>
                <div className="box-border w-full h-[1px] shrink-0 bg-[#E2E8F0]" />
                <a
                  href={missingPpi.href}
                  className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[12px] justify-start items-center bg-[#F3FAFF] rounded-[8px]"
                >
                  <Icon name="plus" fill="#0F6CB8" className="box-border w-[16px] shrink-0 h-[16px]" />
                  <span className="text-[14px]/[normal] box-border text-[#0F6CB8] font-inter font-semibold text-left [white-space:nowrap]">
                    {missingPpi.label}
                  </span>
                </a>
              </>
            )}
          </div>
        )}
      </div>
      {selected.length > 0 && (
        // w-full + wrap (the export is a single w-fit row) so a long selection wraps inside the card.
        <ul className="box-border w-full h-fit shrink-0 flex flex-row flex-wrap gap-[8px] justify-start items-start">
          {selected.map((pelabuhan) => (
            <li
              key={pelabuhan.id}
              className="box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[4px_4px_4px_14px] justify-start items-center bg-[#DCEEFB] rounded-[999px]"
            >
              <span className="text-[13px]/[normal] box-border text-[#0F6CB8] font-inter font-semibold text-left [white-space:nowrap]">
                {pelabuhan.nama}
              </span>
              <button
                type="button"
                aria-label={removeLabel.replace('{nama}', pelabuhan.nama)}
                onClick={() => toggle(pelabuhan)}
                className="box-border w-[28px] shrink-0 h-[28px] flex flex-row gap-0 justify-center items-center rounded-[999px] cursor-pointer"
              >
                <Icon name="x" fill="#0F6CB8" className="box-border w-[14px] shrink-0 h-[14px]" />
              </button>
              <input type="hidden" name={name} value={pelabuhan.id} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
