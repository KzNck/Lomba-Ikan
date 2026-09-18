export function WaveDecoration() {
  return (
    <div aria-hidden="true" className="box-border w-full h-[170px] shrink-0 overflow-hidden relative">
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="box-border w-full h-[160px] absolute left-0 top-[10px] overflow-visible [z-index:0]"
      >
        <path d="M0 60c300-60 620 30 920-5 240-27 400-35 520-15l0 120-1440 0z" fill="#E3F1FC" />
      </svg>
      <svg
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="box-border w-full h-[110px] absolute left-0 top-[60px] overflow-visible [z-index:1]"
      >
        <path d="M0 50c260 50 600-40 900-5 250 30 410-5 540-20l0 85-1440 0z" fill="#D4E9F9" />
      </svg>
    </div>
  )
}
