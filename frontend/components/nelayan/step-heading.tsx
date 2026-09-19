type StepHeadingProps = {
  // Ids let the step's controls point at the title and description (aria-labelledby / aria-describedby).
  id: string
  title: string
  description: string
  // Steps 1–4 keep the description on one line; step 5's is full-width and may wrap.
  descriptionWraps?: boolean
}

// The "Question" block that opens every step of the modal. The description gets the id `${id}-description`.
// The title is focusable from script so the wizard can move focus to it when the step changes.
export function StepHeading({ id, title, description, descriptionWraps }: StepHeadingProps) {
  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start">
      <h3 id={id} tabIndex={-1} className="focus:outline-none text-[18px]/[normal] box-border text-[#0B3B5C] font-poppins font-semibold text-left [white-space:nowrap]">
        {title}
      </h3>
      <p
        id={`${id}-description`}
        className={`text-[14px]/[normal] box-border ${descriptionWraps ? 'w-full' : '[white-space:nowrap]'} text-[#5B6B7C] font-inter font-normal text-left`}
      >
        {description}
      </p>
    </div>
  )
}
