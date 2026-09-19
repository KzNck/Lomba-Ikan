// Shared hover/press recipes (CSS transitions, 200ms ease-out; the press snaps in over 100ms).
// Scale and translate only run for motion-safe users; colour and shadow changes apply to everyone.

// Compact buttons: grow slightly on hover, dip on press.
export const PRESS =
  'transition-[scale,filter,background-color] duration-200 ease-out motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.97] motion-safe:active:duration-100'

// Full-width buttons: a hover scale would visibly widen them, so they only dip on press.
export const PRESS_WIDE =
  'transition-[scale,filter,background-color] duration-200 ease-out motion-safe:active:scale-[0.98] motion-safe:active:duration-100'

// Colour shift on hover: solid/gradient fills brighten, outline and ghost fills pick up a pale tint.
export const SOLID_HOVER = 'hover:brightness-[1.08]'
export const OUTLINE_HOVER = 'hover:bg-[#F3FAFF]'

// Put on an arrow icon inside a `group` link: nudges it along its direction on hover.
export const ARROW_NUDGE_RIGHT = 'transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-[3px]'
export const ARROW_NUDGE_LEFT = 'transition-transform duration-200 ease-out motion-safe:group-hover:-translate-x-[3px]'

// Cards: lift 4px and deepen the shadow. The first shadow layer keeps the cards' 1px hairline ring.
// On `data-reveal` cards the transition itself comes from globals.css, which owns their `transition` property.
export const CARD_LIFT =
  'transition-[translate,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-1 hover:[box-shadow:0px_0px_0px_1px_#0000000F,_0px_12px_28px_-6px_#0B3B5C29]'
