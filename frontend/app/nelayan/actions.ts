'use server'

import { redirect } from 'next/navigation'

// Stand-in for OTP verification and profile saving: until Supabase handles those, both forms land on the dashboard.
export async function enterNelayanDashboard() {
  redirect('/nelayan')
}
