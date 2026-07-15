import { Spinner } from "@/components/ui/Spinner"

function LoadingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50 dark:bg-stone-950">
      <Spinner size="lg" />
      <p className="text-sm text-stone-500 dark:text-stone-400">Cargando...</p>
    </div>
  )
}

export { LoadingPage }
