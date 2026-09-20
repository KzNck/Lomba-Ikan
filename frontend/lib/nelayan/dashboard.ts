// lib/nelayan/dashboard.ts
//
// Merakit data dashboard nelayan dari Supabase. Dipakai halaman /nelayan dan
// halaman "Tambah Tangkapan" yang menampilkan dashboard di belakang modalnya.

import type { NelayanDashboardData } from '@/components/nelayan/dashboard'
import { LISTING_PATH } from '@/components/nelayan/listing-content'
import { toListingCard } from '@/lib/catches/present'
import { getMyCatches } from '@/lib/supabase/catches'
import { getMyTransactions } from '@/lib/supabase/transactions'
import { requireProfile } from '@/lib/supabase/auth'
import { greetingFor, initialsOf, recentNotifications, summaryStats } from './dashboard-data'

export async function loadNelayanDashboard(): Promise<NelayanDashboardData> {
    const profile = await requireProfile('nelayan')
    const [catches, transactions] = await Promise.all([getMyCatches(), getMyTransactions()])

    return {
        greeting: greetingFor(profile.full_name),
        user: { name: profile.full_name, initials: initialsOf(profile.full_name) },
        stats: summaryStats(catches, transactions),
        // Panel dashboard hanya menampilkan tiga listing teraktif.
        listings: catches
            .filter((entry) => entry.status === 'LISTED')
            .slice(0, 3)
            .map((entry) => toListingCard(entry, `${LISTING_PATH}?detail=${entry.id}`)),
        notifications: recentNotifications(catches, transactions),
    }
}
