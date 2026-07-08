import { Link } from "react-router-dom"
import { ShieldOff } from "lucide-react"
import { Button } from "@/components/ui/Button"

function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <ShieldOff size={40} className="text-red-600" />
      </div>
      <h1 className="text-4xl font-bold text-stone-900">403</h1>
      <p className="text-lg text-stone-600">Acceso denegado</p>
      <p className="max-w-md text-sm text-stone-500">
        No tienes permisos para acceder a esta página.
      </p>
      <Link to="/app/dashboard">
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  )
}

export default ForbiddenPage
