import { useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { BackButton } from "@/components/shared/BackButton"
import { LoteForm } from "../components/LoteForm"
import { loteService } from "../services/lote.service"
import { ROUTES } from "@/constants/routes"
import { useNotification } from "@/hooks/useNotification"
import { useState } from "react"
import type { CreateLoteFormData, UpdateLoteFormData } from "../schemas/lote.schema"

function NuevoLotePage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: CreateLoteFormData | UpdateLoteFormData) => {
    setError(null)
    setLoading(true)
    try {
      await loteService.create(data as CreateLoteFormData)
      notify({ type: "success", title: "Lote creado", message: `"${(data as CreateLoteFormData).nombre}" registrado.` })
      navigate(ROUTES.LOTES)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el lote")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Nuevo Lote" description="Registra un nuevo lote en el sistema" actions={<BackButton to="/app/lotes" />} />
      <Card className="max-w-lg">
        <LoteForm
          mode="create"
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          onClearError={() => setError(null)}
          submitLabel="Crear Lote"
        />
      </Card>
    </div>
  )
}

export default NuevoLotePage
