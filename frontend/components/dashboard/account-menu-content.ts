// Copy for the account menu behind the header pill and the sidebar user card.
export const ACCOUNT_MENU = {
  // Accessible name of the trigger; the visible name of the account is read after it.
  triggerLabel: (name: string) => `Menu akun, ${name}`,
  accountLabel: 'Akun',
  signOutLabel: 'Keluar',
  // While the sign-out request is in flight.
  signingOutLabel: 'Keluar…',
  // Shown only when catches are still queued on this device (lib/offline/storage.ts).
  confirm: {
    title: 'Keluar sekarang?',
    body: (count: number) => `Ada ${count} tangkapan belum tersinkron. Jika keluar, data ini bisa hilang.`,
    cancel: 'Batal',
    confirm: 'Tetap Keluar',
  },
}
