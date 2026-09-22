// The waves along the bottom of the main column. The export places them at top-[980px] in a 1100px × 1180px
// column; here they're pinned to the bottom instead.
export function MainDecoration() {
  return (
    <div aria-hidden="true" className="box-border w-full h-[120px] absolute left-0 bottom-0 [z-index:1]">
      <svg
        viewBox="0 0 1180 90"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="box-border w-full h-[90px] absolute left-0 top-[30px] overflow-visible [z-index:0]"
      >
        <path d="M0 40c200-40 380 30 590-5 210-35 390 25 590-10l0 65-1180 0z" fill="#DCEEFB80" />
      </svg>
      <svg
        viewBox="0 0 1180 60"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="box-border w-full h-[60px] absolute left-0 top-[60px] overflow-visible [z-index:1]"
      >
        <path d="M0 30c240 30 420-30 640-5 220 25 360-15 540 5l0 30-1180 0z" fill="#DCEEFBB3" />
      </svg>
    </div>
  )
}
