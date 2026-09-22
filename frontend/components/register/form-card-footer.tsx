// The card's bottom row: sub-step progress on the left, actions on the right. Stacked on phones, actions full width.
export function FormCardFooter({ children }: { children: React.ReactNode }) {
  return (
    // Exported as-is: content-box sizing and the -0.5px margin are how Pen.dev places the hairline divider.
    <div className="[box-sizing:content-box] w-full lg:w-[680px] h-auto lg:h-[79.5px] shrink-0 flex flex-col sm:flex-row gap-[16px] sm:gap-0 p-[20px_0px_0px_0px] sm:p-[24px_0px_0px_0px] justify-between items-stretch sm:items-center [&>button]:w-full sm:[&>button]:w-fit [&>div:last-child]:w-full sm:[&>div:last-child]:w-fit [&>div:last-child>*]:flex-1 sm:[&>div:last-child>*]:[flex:0_1_auto] [border-width:1px_0px_0px_0px] [border-style:solid] [border-color:#E2E8F0] [margin:-0.5px_0px_0px_0px]">
      {children}
    </div>
  )
}
