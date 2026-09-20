// examples/usage-example.tsx
//
// Contoh pemakaian di komponen React — TIDAK perlu dipakai langsung,
// ini cuma referensi buat tim frontend supaya tahu cara panggil fungsinya.

'use client'

import { useEffect, useState } from 'react'
import { subscribeToNewListings } from '@/lib/supabase/realtime'
import { claimCatch } from '@/lib/supabase/transactions'
import type { Catch } from '@/types/database'

export function MarketplaceExample() {
    // Data awal datang dari Server Component (getListedCatches dipanggil di sana);
    // di client tinggal menambahkan listing baru yang masuk lewat realtime.
    const [catches, setCatches] = useState<Catch[]>([])

    useEffect(() => {
        const unsubscribe = subscribeToNewListings((newCatch: Catch) => {
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