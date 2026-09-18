type SubmitButtonProps = {
  label: string
}

export function SubmitButton({ label }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="box-border w-full h-fit shrink-0 [box-shadow:0px_8px_20px_0px_#168BE540] flex flex-row gap-[12px] p-[16px_28px] justify-center items-center [background-image:linear-gradient(90deg,_#168BE5_0%,_#2FA6EC_100%)] bg-no-repeat bg-[length:100%_100%] rounded-[999px] cursor-pointer"
    >
      <span className="text-[16px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
        {label}
      </span>
    </button>
  )
}
