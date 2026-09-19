import { Logo } from '@/components/ui/logo'
import { SidebarNav, type SidebarNavItem } from '@/components/nelayan/sidebar-nav'

type SidebarProps = {
  nav: SidebarNavItem[]
  user: { name: string; initials: string; role: string }
}

// "Sidebar Nelayan". Sticky and viewport-tall, so it stays in place while the main column scrolls. The sea
// decoration is pinned to the bottom (the export's top-[700px] in a 1100px frame) so it stays behind the user card.
export function Sidebar({ nav, user }: SidebarProps) {
  return (
    <aside className="box-border w-[260px] shrink-0 sticky top-0 h-dvh self-start flex flex-col gap-[32px] p-[24px_16px] justify-start items-start [background-image:linear-gradient(180deg,_#0B3B5C_0%,_#0F5C82_100%)] bg-no-repeat bg-[length:100%_100%] overflow-hidden relative">
      <div aria-hidden="true" className="box-border w-[420px] h-[260px] absolute left-[-80px] bottom-[140px] [z-index:0]">
        <svg
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="box-border w-[420px] h-[120px] absolute left-0 top-[40px] overflow-visible [z-index:0]"
        >
          <path d="M0 60c300-60 620 30 920-5 240-27 400-35 520-15l0 120-1440 0z" fill="#FFFFFF0D" />
        </svg>
        <svg
          viewBox="0 0 1440 110"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="box-border w-[420px] h-[170px] absolute left-0 top-[90px] overflow-visible [z-index:1]"
        >
          <path d="M0 50c260 50 600-40 900-5 250 30 410-5 540-20l0 85-1440 0z" fill="#FFFFFF12" />
        </svg>
      </div>
      <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[4px_12px] justify-start items-start relative [z-index:1]">
        <Logo tone="light" />
      </div>
      <SidebarNav items={nav} />
      <div className="box-border w-full [flex:1_1_0] relative [z-index:3]" />
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[12px] justify-start items-center bg-[#FFFFFF14] [border:1px_solid_#FFFFFF1F] rounded-[12px] relative [z-index:4]">
        <div className="box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#168BE5] rounded-[999px]">
          <span aria-hidden="true" className="text-[14px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
            {user.initials}
          </span>
        </div>
        <div className="box-border [flex:1_1_0] h-fit flex flex-col gap-[2px] justify-start items-start">
          <p className="text-[14px]/[normal] box-border text-[#FFFFFF] font-inter font-semibold text-left [white-space:nowrap]">{user.name}</p>
          <p className="text-[13px]/[normal] box-border w-full text-[#D6E9F5] font-inter font-normal text-left">{user.role}</p>
        </div>
      </div>
    </aside>
  )
}
