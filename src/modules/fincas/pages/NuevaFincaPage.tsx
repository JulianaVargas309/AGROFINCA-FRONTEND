import { useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { FincaForm } from "../components/FincaForm"
import { fincaService } from "../services/finca.service"
import { ROUTES } from "@/constants/routes"
import { useNotification } from "@/hooks/useNotification"
import { useState } from "react"
import type { CreateFincaFormData, UpdateFincaFormData } from "../schemas/finca.schema"

function NuevaFincaPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: CreateFincaFormData) => {
    setError(null)
    setLoading(true)
    try {
      await fincaService.create(data)
      notify({ type: "success", title: "Finca creada", message: `"${data.nombre}" registrada correctamente.` })
      navigate(ROUTES.FINCAS)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la finca")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Nueva Finca" description="Registra una nueva finca en el sistema" />
      <Card className="max-w-lg">
        <FincaForm
          mode="create"
          onSubmit={handleSubmit as (data: CreateFincaFormData | UpdateFincaFormData) => Promise<void>}
          loading={loading}
          error={error}
          onClearError={() => setError(null)}
          submitLabel="Crear Finca"
        />
      </Card>
    </div>
  )
}

export default NuevaFincaPage
