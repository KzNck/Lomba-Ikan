'use server'

import { redirect } from 'next/navigation'

// Stand-in for OTP verification and profile saving: until Supabase handles those, both forms land on the dashboard.
export async function enterNelayanDashboard() {
  redirect('/nelayan')
}

// Stand-in for publishing the graded catch as a listing (with the optional "Harga Jual" in `harga`).
export async function publishListing() {
  redirect('/nelayan')
}

// Stand-in for cancelling the listing whose slug is in `id`: until Supabase holds listings, it just closes the drawer.
export async function cancelListing() {
  redirect('/nelayan/listing')
}
