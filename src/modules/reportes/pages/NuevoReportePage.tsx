import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { ReporteForm } from "../components/ReporteForm"
import { reportesService } from "../services/reportes.service"
import type { ReportType } from "../types/reporte.types"
import { ArrowLeft, BarChart3 } from "lucide-react"

function NuevoReportePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: { tipo: ReportType; fechaDesde?: string; fechaHasta?: string }) => {
    setLoading(true)
    setError(null)
    try {
      const reportData = await reportesService.generateReport(data.tipo)
      navigate(`/app/reportes/${data.tipo}`, { state: { data: reportData, tipo: data.tipo } })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar el reporte")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Nuevo Reporte"
        description="Configura y genera un nuevo reporte"
        actions={
          <Link to="/app/reportes">
            <Button variant="outline">
              <ArrowLeft size={16} />
              Volver
            </Button>
          </Link>
        }
      />
      {error && <Alert severity="error">{error}</Alert>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Configuración del Reporte">
            <ReporteForm onSubmit={handleSubmit} loading={loading} />
          </Card>
        </div>
        <div>
          <Card title="Tipos de Reporte">
            <div className="space-y-3 text-sm text-stone-600">
              <p><strong>Inventario:</strong> Productos, stock y valor del inventario</p>
              <p><strong>Financiero:</strong> Ingresos y gastos mensuales</p>
              <p><strong>Producción:</strong> Cultivos por estado y rendimiento</p>
              <p><strong>Costos por Lote:</strong> Costos acumulados de bitácora y jornales</p>
              <p><strong>Bitácora:</strong> Registro completo de actividades</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default NuevoReportePage
