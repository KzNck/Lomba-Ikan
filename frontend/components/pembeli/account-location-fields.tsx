'use client'

import { useState } from 'react'
import { FormField, type FormFieldConfig } from '@/components/register/form-field'
import { PROVINSI, getKabupatenKota, type Wilayah } from '@/lib/wilayah'

type SelectCopy = Pick<FormFieldConfig, 'id' | 'label' | 'icon' | 'placeholder'>

type AccountLocationFieldsProps = {
  provinsi: SelectCopy
  kabKota: SelectCopy & { lockedHelper: string }
  // The saved choice (Kemendagri codes).
  defaultProvinsi: string
  defaultKabKota: string
  errors: { provinsi?: string; kabKota?: string }
}

const toOptions = (items: Wilayah[]) => items.map((item) => ({ value: item.kode, label: item.nama }))
const PROVINSI_OPTIONS = toOptions(PROVINSI)

// Row 4: Provinsi → Kota/kabupaten, like registration's LocationFields but opening on the saved choice and without
// the port step. Changing the province clears the city.
export function AccountLocationFields({ provinsi, kabKota, defaultProvinsi, defaultKabKota, errors }: AccountLocationFieldsProps) {
  const [provinsiKode, setProvinsiKode] = useState(defaultProvinsi)
  const [kabKotaKode, setKabKotaKode] = useState(defaultKabKota)

  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[20px] justify-start items-start">
      <FormField
        kind="select"
        {...provinsi}
        grow
        look="settings"
        required
        error={errors.provinsi}
        options={PROVINSI_OPTIONS}
        value={provinsiKode}
        onChange={(kode) => {
          setProvinsiKode(kode)
          setKabKotaKode('')
        }}
      />
      <FormField
        kind="select"
        {...kabKota}
        grow
        look="settings"
        required
        disabled={!provinsiKode}
        helper={provinsiKode ? undefined : kabKota.lockedHelper}
        error={errors.kabKota}
        options={provinsiKode ? toOptions(getKabupatenKota(provinsiKode)) : []}
        value={kabKotaKode}
        onChange={setKabKotaKode}
      />
    </div>
  )
}
