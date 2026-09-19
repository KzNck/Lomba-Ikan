// The "Fokus keyboard (:focus-visible)" state: a 2px #0F6CB8 ring sitting 2px outside the control.
// Drawn with box-shadow because several controls already use `outline` for their border. Forced-colors mode drops
// box-shadow, so `outline-hidden` (unlike `outline-none`) keeps a system-coloured outline there.
export const FOCUS_RING =
  'focus-visible:outline-hidden focus-visible:[box-shadow:0px_0px_0px_2px_#FFFFFF,_0px_0px_0px_4px_#0F6CB8]'
