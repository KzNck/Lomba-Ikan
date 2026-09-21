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
import { displayNameFor } from '@/lib/supabase/display-name'
import { greetingFor, initialsOf, recentNotifications, summaryStats } from './dashboard-data'

export async function loadNelayanDashboard(): Promise<NelayanDashboardData> {
    // The profile and the data load together: RLS already scopes the catches and transactions to this user, so they
    // needn't wait for the role check (which redirects if it fails).
    const [profile, catches, transactions] = await Promise.all([requireProfile('nelayan'), getMyCatches(), getMyTransactions()])
    const name = await displayNameFor(profile)

    return {
        greeting: greetingFor(name),
        user: { name, initials: initialsOf(profile.full_name) },
        stats: summaryStats(catches, transactions),
        // Panel dashboard hanya menampilkan tiga listing teraktif.
        listings: catches
            .filter((entry) => entry.status === 'LISTED')
            .slice(0, 3)
            .map((entry) => toListingCard(entry, `${LISTING_PATH}?detail=${entry.id}`)),
        notifications: recentNotifications(catches, transactions),
    }
}
