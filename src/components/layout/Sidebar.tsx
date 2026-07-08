import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  MapPin,
  Sprout,
  ClipboardList,
  DollarSign,
  BarChart3,
  Package,
} from "lucide-react"
import { cn } from "@/utils/cn"

const navigationItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/fincas", label: "Fincas", icon: MapPin },
  { to: "/app/lotes", label: "Lotes", icon: Sprout },
  { to: "/app/inventario", label: "Inventario", icon: Package },
  { to: "/app/bitacora", label: "Bitácora", icon: ClipboardList },
  { to: "/app/finanzas", label: "Finanzas", icon: DollarSign },
  { to: "/app/reportes", label: "Reportes", icon: BarChart3 },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-stone-200 bg-white transition-transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <nav className="flex flex-col gap-1 p-3 overflow-y-auto h-full">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export { Sidebar }
export type { SidebarProps }
