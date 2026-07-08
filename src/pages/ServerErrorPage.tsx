import { ServerCrash } from "lucide-react"
import { Button } from "@/components/ui/Button"

function ServerErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
        <ServerCrash size={40} className="text-amber-600" />
      </div>
      <h1 className="text-4xl font-bold text-stone-900">500</h1>
      <p className="text-lg text-stone-600">Error del servidor</p>
      <p className="max-w-md text-sm text-stone-500">
        Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.
      </p>
      <Button
        variant="outline"
        onClick={() => window.location.reload()}
      >
        Reintentar
      </Button>
    </div>
  )
}

export default ServerErrorPage
