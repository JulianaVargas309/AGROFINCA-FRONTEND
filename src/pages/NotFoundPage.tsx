import { Link } from "react-router-dom"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/Button"

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
        <FileQuestion size={40} className="text-stone-400" />
      </div>
      <h1 className="text-4xl font-bold text-stone-900">404</h1>
      <p className="text-lg text-stone-600">Página no encontrada</p>
      <p className="max-w-md text-sm text-stone-500">
        La página que buscas no existe o ha sido movida.
      </p>
      <Link to="/app/dashboard">
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  )
}

export default NotFoundPage
