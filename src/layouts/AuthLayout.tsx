import { Outlet } from "react-router-dom"
import { Sprout } from "lucide-react"

function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 items-center justify-center bg-emerald-800 lg:flex">
        <div className="max-w-md text-center text-white">
          <Sprout size={80} className="mx-auto mb-6" />
          <h1 className="text-4xl font-bold">AgroFinca Familiar</h1>
          <p className="mt-4 text-lg text-emerald-200">
            Sistema de gestión agrícola para cultivos de café y caña de azúcar
          </p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-stone-50 dark:bg-stone-950 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <Sprout className="h-8 w-8 text-emerald-700 dark:text-emerald-400" />
            <span className="text-xl font-bold text-stone-900 dark:text-stone-100">AgroFinca</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
