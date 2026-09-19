'use server'

import { redirect } from 'next/navigation'

// Stand-in for saving the registration: until Supabase handles it, finishing the form lands on the dashboard.
export async function enterPembeliDashboard() {
  redirect('/pembeli')
}
