type BackButtonProps = {
  label: string
  onClick: () => void
}

// Secondary outline button, e.g. "Kembali" to the previous part of a form.
export function BackButton({ label, onClick }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] p-[15px_26px_15px_28px] justify-center items-center bg-[#FFFFFF] [outline:1.5px_solid_#168BE5] [outline-offset:-0.75px] rounded-[999px] cursor-pointer"
    >
      <span className="text-[16px]/[normal] box-border text-[#168BE5] font-poppins font-semibold text-left [white-space:nowrap]">
        {label}
      </span>
    </button>
  )
}
