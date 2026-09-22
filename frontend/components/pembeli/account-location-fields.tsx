'use client'

import { useState } from 'react'
import { FormField, type FormFieldConfig } from '@/components/register/form-field'
import { PROVINSI, getKabupatenKota, getPelabuhan, type Wilayah } from '@/lib/wilayah'

type SelectCopy = Pick<FormFieldConfig, 'id' | 'label' | 'icon' | 'placeholder'>

type AccountLocationFieldsProps = {
  provinsi: SelectCopy
  kabKota: SelectCopy & { lockedHelper: string }
  // The port step, for the nelayan account: on its own row under the other two.
  pelabuhan?: SelectCopy & { lockedHelper: string; emptyHelper: string }
  // The saved choice (Kemendagri codes, then the port's id).
  defaultProvinsi: string
  defaultKabKota: string
  defaultPelabuhan?: string
  errors: { provinsi?: string; kabKota?: string; pelabuhan?: string }
}

const toOptions = (items: Wilayah[]) => items.map((item) => ({ value: item.kode, label: item.nama }))
const PROVINSI_OPTIONS = toOptions(PROVINSI)

// Provinsi → Kota/kabupaten (→ PPI when `pelabuhan` is given), like registration's LocationFields but opening on the
// saved choice. Changing a level clears the ones below it.
export function AccountLocationFields({
  provinsi,
  kabKota,
  pelabuhan,
  defaultProvinsi,
  defaultKabKota,
  defaultPelabuhan = '',
  errors,
}: AccountLocationFieldsProps) {
  const [provinsiKode, setProvinsiKode] = useState(defaultProvinsi)
  const [kabKotaKode, setKabKotaKode] = useState(defaultKabKota)
  const [pelabuhanId, setPelabuhanId] = useState(defaultPelabuhan)

  const pelabuhanOptions = kabKotaKode ? getPelabuhan(kabKotaKode).map((p) => ({ value: p.id, label: p.nama })) : []
  const noPelabuhan = kabKotaKode !== '' && pelabuhanOptions.length === 0

  return (
    <>
      <div className="box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-[18px] sm:gap-[20px] justify-start items-stretch sm:items-start">
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
            setPelabuhanId('')
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
          onChange={(kode) => {
            setKabKotaKode(kode)
            setPelabuhanId('')
          }}
        />
      </div>
      {pelabuhan && (
        <FormField
          kind="select"
          {...pelabuhan}
          look="settings"
          required
          disabled={!kabKotaKode || noPelabuhan}
          helper={!kabKotaKode ? pelabuhan.lockedHelper : noPelabuhan ? pelabuhan.emptyHelper : undefined}
          error={errors.pelabuhan}
          options={pelabuhanOptions}
          value={pelabuhanId}
          onChange={setPelabuhanId}
        />
      )}
    </>
  )
}
