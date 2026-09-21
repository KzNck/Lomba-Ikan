// lib/nelayan/dashboard.ts
//
// Merakit data dashboard nelayan dari Supabase. Dipakai halaman /nelayan dan
// halaman "Tambah Tangkapan" yang menampilkan dashboard di belakang modalnya.

import type { NelayanDashboardData } from '@/components/nelayan/dashboard'
import { LISTING_PATH } from '@/components/nelayan/listing-content'
import { toListingCard } from '@/lib/catches/present'
import { getTranslations } from 'next-intl/server'
import { getPresenter } from '@/lib/i18n/presenter'
import { getMyCatches } from '@/lib/supabase/catches'
import { getMyTransactions } from '@/lib/supabase/transactions'
import { requireProfile } from '@/lib/supabase/auth'
import { displayNameFor } from '@/lib/supabase/display-name'
import { greetingFor, initialsOf, recentNotifications, summaryStats } from './dashboard-data'

export async function loadNelayanDashboard(): Promise<NelayanDashboardData> {
    // The profile and the data load together: RLS already scopes the catches and transactions to this user, so they
    // needn't wait for the role check (which redirects if it fails).
    const [profile, catches, transactions, p] = await Promise.all([
        requireProfile('nelayan'),
        getMyCatches(),
        getMyTransactions(),
        getPresenter(),
    ])
    const home = await getTranslations('dashboard.nelayan.home')
    const name = await displayNameFor(profile)

    return {
        greeting: greetingFor(home, name),
        user: { name, initials: initialsOf(profile.full_name) },
        stats: summaryStats(p, home, catches, transactions),
        // Panel dashboard hanya menampilkan tiga listing teraktif.
        listings: catches
            .filter((entry) => entry.status === 'LISTED')
            .slice(0, 3)
            .map((entry) => toListingCard(p, entry, `${LISTING_PATH}?detail=${entry.id}`)),
        notifications: recentNotifications(p, home, catches, transactions),
    }
}
