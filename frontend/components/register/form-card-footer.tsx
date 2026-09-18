// The card's bottom row: sub-step progress on the left, actions on the right.
export function FormCardFooter({ children }: { children: React.ReactNode }) {
  return (
    // Exported as-is: content-box sizing and the -0.5px margin are how Pen.dev places the hairline divider.
    <div className="[box-sizing:content-box] w-[680px] h-[79.5px] shrink-0 flex flex-row gap-0 p-[24px_0px_0px_0px] justify-between items-center [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0] [margin:-0.5px_0px_0px_0px]">
      {children}
    </div>
  )
}
