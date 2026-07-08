import { useNavigate, useSearchParams } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { GastoForm } from "../components/GastoForm"
import { VentaForm } from "../components/VentaForm"
import { finanzaService } from "../services/finanza.service"
import { ROUTES } from "@/constants/routes"
import { useNotification } from "@/hooks/useNotification"
import { useState } from "react"
import type { CreateGastoFormData, UpdateGastoFormData, CreateVentaFormData } from "../schemas/finanza.schema"

function NuevaFinanzapage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tipo = searchParams.get("tipo") === "venta" ? "venta" : "gasto"
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGasto = async (data: CreateGastoFormData | UpdateGastoFormData) => {
    setError(null)
    setLoading(true)
    try {
      await finanzaService.createGasto(data as CreateGastoFormData)
      notify({ type: "success", title: "Gasto registrado" })
      navigate(ROUTES.FINANZAS)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar gasto")
    } finally { setLoading(false) }
  }

  const handleVenta = async (data: CreateVentaFormData) => {
    setError(null)
    setLoading(true)
    try {
      await finanzaService.createVenta(data)
      notify({ type: "success", title: "Venta registrada" })
      navigate(ROUTES.FINANZAS)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar venta")
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title={tipo === "gasto" ? "Nuevo Gasto" : "Nueva Venta"} description={tipo === "gasto" ? "Registra un gasto" : "Registra una venta"} />
      <Card className="max-w-lg">
        {tipo === "gasto" ? (
          <GastoForm mode="create" onSubmit={handleGasto} loading={loading} error={error} onClearError={() => setError(null)} submitLabel="Registrar Gasto" />
        ) : (
          <VentaForm onSubmit={handleVenta} loading={loading} />
        )}
      </Card>
    </div>
  )
}

export default NuevaFinanzapage
