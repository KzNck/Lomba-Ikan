'use client'

import { useEffect, useRef } from 'react'

/**
 * Setelah submit ditolak, pindahkan fokus ke tempat masalahnya: kolom pertama
 * yang gagal divalidasi, atau — kalau error-nya tidak menempel ke satu kolom —
 * ke pesan error form.
 *
 * `state` dipakai sebagai dependency (bukan pesannya), karena tiap submit
 * mengembalikan objek baru: error yang sama dua kali tetap memindahkan fokus.
 */
export function useErrorFocus(state: { error?: string }) {
    const first = useRef(true)

    useEffect(() => {
        // Render pertama belum ada submit apa pun, jadi jangan curi fokus.
        if (first.current) {
            first.current = false
            return
        }
        if (!state.error) return

        const target = document.querySelector<HTMLElement>('[aria-invalid="true"], [data-form-error]:not(.sr-only)')
        target?.focus()
    }, [state])
}
