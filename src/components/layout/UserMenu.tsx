import { useState, useRef, useEffect } from "react"
import { LogOut, User, Settings } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants/routes"

function UserMenu() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
          {user?.nombre?.charAt(0).toUpperCase() ?? "U"}
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium text-stone-700 dark:text-stone-200 leading-tight">
            {user?.nombre ?? user?.documento ?? "Usuario"}
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-tight">{user?.rol ?? ""}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 py-1 shadow-lg">
          <button
            onClick={() => {
              navigate(ROUTES.PERFIL)
              setIsOpen(false)
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
          >
            <User size={16} />
            Perfil
          </button>
          <button
            onClick={() => {
              navigate(ROUTES.CONFIGURACION)
              setIsOpen(false)
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
          >
            <Settings size={16} />
            Configuración
          </button>
          <hr className="my-1 border-stone-100 dark:border-stone-700" />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  )
}

export { UserMenu }
