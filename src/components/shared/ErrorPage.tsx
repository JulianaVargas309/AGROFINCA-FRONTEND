import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface ErrorPageProps {
  title?: string
  message?: string
  onRetry?: () => void
}

function ErrorPage({
  title = "Error inesperado",
  message = "Ocurrió un error al cargar esta página.",
  onRetry,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-xl font-semibold text-stone-900">{title}</h2>
      <p className="max-w-md text-sm text-stone-500">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}

export { ErrorPage }
export type { ErrorPageProps }
