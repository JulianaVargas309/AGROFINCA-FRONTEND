import { useState } from "react"
import { NavLink, Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { ROUTES } from "@/constants/routes"
import {
  LayoutDashboard,
  Sprout,
  Package,
  Users,
  Wallet,
  BarChart3,
  Settings,
  UserCircle,
  MapPin,
  Leaf,
  Tractor,
  Activity,
  Sun,
  ClipboardCheck,
  Truck,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  ChevronDown,
  ArrowLeftRight,
  UserCog,
  ScrollText,
  ClipboardList,
  LogOut,
} from "lucide-react"
import { cn } from "@/utils/cn"
import { Rol } from "@/types"

const menuGroups = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    children: [{ to: "/app/dashboard", label: "Inicio" }],
  },
  {
    label: "Producción",
    icon: Sprout,
    children: [
      { to: "/app/fincas", label: "Fincas", icon: MapPin },
      { to: "/app/lotes", label: "Lotes", icon: Leaf },
      { to: "/app/cultivos", label: "Cultivos", icon: Tractor },
    ],
  },
  {
    label: "Actividades",
    icon: Activity,
    children: [
      { to: "/app/actividades", label: "Todas", icon: ClipboardList },
    ],
  },
  {
    label: "Inventario",
    icon: Package,
    children: [
      { to: "/app/inventario", label: "Productos", icon: Package },
      { to: "/app/movimientos", label: "Entradas/Salidas", icon: ArrowLeftRight },
      { to: "/app/compras", label: "Proveedores", icon: Truck },
    ],
  },
  {
    label: "Personal",
    icon: Users,
    children: [
      { to: "/app/trabajadores", label: "Trabajadores", icon: Users },
      { to: "/app/jornales", label: "Jornales", icon: Sun },
      { to: "/app/asistencias", label: "Asistencias", icon: ClipboardCheck },
    ],
  },
  {
    label: "Finanzas",
    icon: Wallet,
    children: [
      { to: "/app/ventas", label: "Ventas", icon: ShoppingCart },
      { to: "/app/gastos", label: "Gastos", icon: CreditCard },
      { to: "/app/flujo", label: "Flujo de Caja", icon: TrendingUp },
    ],
  },
  {
    label: "Reportes",
    icon: BarChart3,
    children: [
      { to: "/app/reportes", label: "Generar", icon: BarChart3 },
    ],
  },
  {
    label: "Configuración",
    icon: Settings,
    adminOnly: true,
    children: [
      { to: "/app/usuarios", label: "Usuarios", icon: UserCog },
      { to: "/app/perfil", label: "Mi Perfil", icon: UserCircle },
      { to: "/app/configuracion", label: "Ajustes", icon: Settings },
    ],
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.rol === Rol.ADMIN
  const isTrabajador = user?.rol === Rol.TRABAJADOR

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const saved: Record<string, boolean> = {}
    menuGroups.forEach((g) => { saved[g.label] = true })
    return saved
  })

  const toggleGroup = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !(prev[label] ?? true) }))
  }

  const isExpanded = (label: string) => expanded[label] ?? true

  const trabajadorGroups = new Set(["Dashboard", "Actividades"])
  const visibleGroups = menuGroups.filter((g) => {
    if (isTrabajador) {
      if (g.label === "Personal") {
        return g.children.some((c) => c.to === "/app/jornales")
      }
      return trabajadorGroups.has(g.label)
    }
    return !g.adminOnly || isAdmin
  })

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 transition-transform lg:translate-x-0 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <nav className="flex flex-col gap-1 p-3 pb-20">
          {visibleGroups.map((group) => {
            const expanded = isExpanded(group.label)
            const Icon = group.icon
            const isActiveGroup = group.children.some((child) =>
              window.location.pathname.startsWith(child.to)
            )

            if (group.children.length === 1 && group.children[0].label === "Inicio") {
              return (
                <NavLink
                  key={group.label}
                  to={group.children[0].to}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                        : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200",
                    )
                  }
                >
                  <Icon size={18} />
                  <span>{group.label}</span>
                </NavLink>
              )
            }

            return (
              <div key={group.label}>
                <button
                  onClick={() => toggleGroup(group.label)}
                  className={cn(
                    "flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                    isActiveGroup
                      ? "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                      : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{group.label}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "transition-transform text-stone-400",
                      expanded ? "rotate-0" : "-rotate-90",
                    )}
                  />
                </button>
                {expanded && (
                  <div className="ml-2 mt-0.5 space-y-0.5 border-l-2 border-stone-100 dark:border-stone-800 pl-2">
                    {group.children.filter((child) => isTrabajador ? child.to === "/app/jornales" : true).map((child) => {
                      const ChildIcon = child.icon
                      return (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          onClick={onClose}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                              isActive
                                ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-semibold"
                                : "text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-200",
                            )
                          }
                        >
                          {ChildIcon ? <ChildIcon size={16} /> : <Icon size={16} />}
                          {child.label}
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
        <div className="p-3 border-t border-stone-200 dark:border-stone-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export { Sidebar }
export type { SidebarProps }
