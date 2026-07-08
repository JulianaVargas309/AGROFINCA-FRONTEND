import { useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { BitacoraForm } from "../components/BitacoraForm"
import { bitacoraService } from "../services/bitacora.service"
import { ROUTES } from "@/constants/routes"
import { useNotification } from "@/hooks/useNotification"
import { useState } from "react"
import type { CreateBitacoraFormData, UpdateBitacoraFormData } from "../schemas/bitacora.schema"

function NuevaBitacoraPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: CreateBitacoraFormData | UpdateBitacoraFormData) => {
    setError(null)
    setLoading(true)
    try {
      await bitacoraService.create(data as CreateBitacoraFormData)
      notify({ type: "success", title: "Actividad registrada", message: "El registro fue creado en la bitácora." })
      navigate(ROUTES.BITACORA)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar actividad")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Nueva Actividad" description="Registra una actividad en la bitácora" />
      <Card className="max-w-lg">
        <BitacoraForm mode="create" onSubmit={handleSubmit} loading={loading} error={error} onClearError={() => setError(null)} submitLabel="Registrar Actividad" />
      </Card>
    </div>
  )
}

export default NuevaBitacoraPage
