import { Menu, X, Sprout } from "lucide-react"
import { UserMenu } from "./UserMenu"
import { NotificationBell } from "./NotificationBell"
import type { ReactNode } from "react"

interface NavbarProps {
  onToggleSidebar: () => void
  sidebarOpen: boolean
  children?: ReactNode
}

function Navbar({ onToggleSidebar, sidebarOpen, children }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 lg:hidden cursor-pointer"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <Sprout className="h-7 w-7 text-emerald-700" />
          <span className="text-lg font-bold text-stone-900 hidden sm:block">
            AgroFinca
          </span>
        </div>
      </div>

      {children}

      <div className="flex items-center gap-1">
        <NotificationBell count={3} />
        <UserMenu />
      </div>
    </header>
  )
}

export { Navbar }
export type { NavbarProps }
