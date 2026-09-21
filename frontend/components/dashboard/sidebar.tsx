import { Logo } from '@/components/ui/logo'
import { Icon } from '@/components/ui/icon'
import { AccountMenu } from '@/components/dashboard/account-menu'
import { FOCUS_RING } from '@/components/nelayan/focus-ring'
import { SidebarNav, type SidebarNavItem, type SidebarNotifications } from '@/components/dashboard/sidebar-nav'

// Where the two role frames differ. The pembeli export's "Sea Decoration" waves have empty paths (they render
// nothing), so only the nelayan sidebar draws them.
const ROLE_STYLES = {
  nelayan: {
    waves: true,
    navFont: 'font-inter',
    // One line: a name longer than the card ends in an ellipsis, with the full name on hover.
    userName: 'text-[14px]/[normal] box-border w-full text-[#FFFFFF] font-inter font-semibold text-left truncate',
    // Initials avatar, no menu chevron.
    menu: false,
  },
  pembeli: {
    waves: false,
    navFont: 'font-poppins',
    // Business names run long ("CV Maggot Sejahtera"), so they wrap.
    userName: 'text-[14px]/[18px] box-border w-full text-[#FFFFFF] font-poppins font-semibold text-left',
    // Fish-icon avatar plus a chevron.
    menu: true,
  },
}

type SidebarProps = {
  role: keyof typeof ROLE_STYLES
  nav: SidebarNavItem[]
  notifications?: SidebarNotifications
  // Without initials the avatar shows the fish icon.
  user: { name: string; role: string; initials?: string }
  // Where the card's account menu sends "Akun".
  accountHref: string
}

// The dashboard sidebar shared by both roles. Sticky and viewport-tall, so it stays in place while the main column
// scrolls. The sea decoration is pinned to the bottom (the export's top-[700px] in a 1100px frame).
export function Sidebar({ role, nav, notifications, user, accountHref }: SidebarProps) {
  const style = ROLE_STYLES[role]

  return (
    <aside className="box-border w-[260px] shrink-0 sticky top-0 h-dvh self-start flex flex-col gap-[32px] p-[24px_16px] justify-start items-start [background-image:linear-gradient(180deg,_#0B3B5C_0%,_#0F5C82_100%)] bg-no-repeat bg-[length:100%_100%] overflow-hidden relative">
      {style.waves && <SeaDecoration />}
      <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[4px_12px] justify-start items-start relative [z-index:1]">
        <Logo tone="light" />
      </div>
      <SidebarNav items={nav} labelFont={style.navFont} notifications={notifications} />
      {/* The card opens the account menu: on a narrow screen it is the only way to reach "Keluar". The nelayan
          frame draws no chevron, but the card is a control now, so it gets one in both roles. */}
      <div className="box-border w-full h-fit shrink-0 relative [z-index:5]">
        <AccountMenu
          name={user.name}
          accountHref={accountHref}
          placement="above"
          chevronFill="#D6E9F5"
          triggerClassName={`box-border w-full h-fit flex flex-row gap-[12px] p-[12px] justify-start items-center bg-[#FFFFFF14] hover:bg-[#FFFFFF24] [border:1px_solid_#FFFFFF1F] rounded-[12px] cursor-pointer transition-colors duration-200 ease-out ${FOCUS_RING}`}
        >
          <span className="box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#168BE5] rounded-[999px]">
            {user.initials ? (
              <span aria-hidden="true" className="text-[14px]/[normal] box-border text-[#FFFFFF] font-poppins font-semibold text-left [white-space:nowrap]">
                {user.initials}
              </span>
            ) : (
              <Icon name="fish" fill="#FFFFFF" className="box-border w-[20px] shrink-0 h-[20px]" />
            )}
          </span>
          <span className="box-border [flex:1_1_0] min-w-0 h-fit flex flex-col gap-[2px] justify-start items-start">
            <span className={style.userName} title={user.name}>
              {user.name}
            </span>
            <span className="text-[13px]/[normal] box-border w-full text-[#D6E9F5] font-inter font-normal text-left">{user.role}</span>
          </span>
        </AccountMenu>
      </div>
    </aside>
  )
}

function SeaDecoration() {
  return (
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
  )
}
