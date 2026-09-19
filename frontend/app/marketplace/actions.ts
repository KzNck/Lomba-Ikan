'use server'

import { redirect } from 'next/navigation'

// Stand-in for buying the batch whose slug is in `slug`: until orders live in Supabase, it lands on the dashboard.
export async function buyBatch() {
  redirect('/pembeli')
}
