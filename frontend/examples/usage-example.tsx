// examples/usage-example.tsx
//
// Contoh pemakaian di komponen React — TIDAK perlu dipakai langsung,
// ini cuma referensi buat tim frontend supaya tahu cara panggil fungsinya.

'use client'

import { useEffect, useState } from 'react'
import { getListedCatches, subscribeToNewListings } from '@/lib/supabase/catches'
import { claimCatch } from '@/lib/supabase/transactions'
import type { Catch } from '@/types/database'

export function MarketplaceExample() {
    const [catches, setCatches] = useState<Catch[]>([])

    useEffect(() => {
        // Ambil data awal
        getListedCatches().then(setCatches).catch(console.error)

        // Subscribe realtime — listing baru langsung muncul tanpa refresh
        const unsubscribe = subscribeToNewListings((newCatch) => {
            setCatches((prev) => [newCatch, ...prev])
        })

        return unsubscribe
    }, [])

    async function handleClaim(catchItem: Catch) {
        try {
            const estimatedTotal = catchItem.weight_kg * (catchItem.price_per_kg ?? 0)
            const transaction = await claimCatch(catchItem.id, estimatedTotal)
            console.log('Berhasil klaim:', transaction)
            // tinggal hias UI-nya di sini
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            {/* Tim frontend tinggal styling bagian ini */}
            {catches.map((c) => (
                <div key={c.id}>
                    <p>{c.species} — {c.weight_kg}kg — Grade {c.freshness_grade}</p>
                    <button onClick={() => handleClaim(c)}>Klaim</button>
                </div>
            ))}
        </div>
    )
}