'use client'

import { useState } from 'react'
import { FormField, type FormFieldConfig } from '@/components/register/form-field'
import { PROVINSI, getKabupatenKota, getPelabuhan, type Wilayah } from '@/lib/wilayah'

type SelectCopy = Pick<FormFieldConfig, 'id' | 'label' | 'icon' | 'placeholder'>

export type LocationFieldsContent = {
  provinsi: SelectCopy
  kabKota: SelectCopy & {
    // Shown while no provinsi is chosen.
    lockedHelper: string
  }
  pelabuhan: SelectCopy & {
    // Shown while no kabupaten/kota is chosen.
    lockedHelper: string
    // Shown when the chosen kabupaten/kota has no registered port.
    emptyHelper: string
  }
}

const toOptions = (items: Pick<Wilayah, 'kode' | 'nama'>[]) =>
  items.map((item) => ({ value: item.kode, label: item.nama }))

const PROVINSI_OPTIONS = toOptions(PROVINSI)

// Provinsi → Kabupaten/Kota → PPI. Changing a level clears the ones below it.
export function LocationFields({ provinsi, kabKota, pelabuhan }: LocationFieldsContent) {
  const [provinsiKode, setProvinsiKode] = useState('')
  const [kabKotaKode, setKabKotaKode] = useState('')
  const [pelabuhanKode, setPelabuhanKode] = useState('')

  const kabKotaOptions = provinsiKode ? toOptions(getKabupatenKota(provinsiKode)) : []
  const pelabuhanOptions = kabKotaKode ? toOptions(getPelabuhan(kabKotaKode)) : []
  const noPelabuhan = kabKotaKode !== '' && pelabuhanOptions.length === 0

  return (
    <>
      <FormField
        kind="select"
        {...provinsi}
        required
        options={PROVINSI_OPTIONS}
        value={provinsiKode}
        onChange={(kode) => {
          setProvinsiKode(kode)
          setKabKotaKode('')
          setPelabuhanKode('')
        }}
      />
      <FormField
        kind="select"
        {...kabKota}
        required
        disabled={!provinsiKode}
        helper={provinsiKode ? undefined : kabKota.lockedHelper}
        options={kabKotaOptions}
        value={kabKotaKode}
        onChange={(kode) => {
          setKabKotaKode(kode)
          setPelabuhanKode('')
        }}
      />
      <FormField
        kind="select"
        {...pelabuhan}
        required
        disabled={!kabKotaKode || noPelabuhan}
        helper={!kabKotaKode ? pelabuhan.lockedHelper : noPelabuhan ? pelabuhan.emptyHelper : undefined}
        options={pelabuhanOptions}
        value={pelabuhanKode}
        onChange={setPelabuhanKode}
      />
    </>
  )
}
