import { useParams, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { usePresupuesto } from "../hooks/usePresupuesto"
import type { PresupuestoPartida } from "../types/presupuestos.types"
import { formatDate } from "@/utils/formatDate"
import { formatCurrency } from "@/utils/formatCurrency"
import { ArrowLeft, CheckCircle, PlayCircle, Lock, FileEdit } from "lucide-react"

const estadoBadge: Record<string, "success" | "warning" | "error" | "info"> = {
  BORRADOR: "warning",
  APROBADO: "info",
  EJECUTANDO: "success",
  CERRADO: "error",
}

const partidaColumns: Column<PresupuestoPartida>[] = [
  { key: "concepto", header: "Concepto" },
  { key: "categoria", header: "Categoría", render: (item) => item.categoria || "-" },
  { key: "montoPrevisto", header: "Previsto", render: (item) => formatCurrency(item.montoPrevisto) },
  { key: "montoEjecutado", header: "Ejecutado", render: (item) => formatCurrency(item.montoEjecutado) },
  {
    key: "avance",
    header: "Avance",
    render: (item) => {
      const pct = item.montoPrevisto > 0 ? Math.round((item.montoEjecutado / item.montoPrevisto) * 100) : 0
      return (
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${pct > 80 ? "bg-emerald-500" : pct > 50 ? "bg-amber-500" : "bg-red-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-medium text-stone-600 dark:text-stone-300">{pct}%</span>
        </div>
      )
    },
  },
]

function DetallePresupuestoPage() {
  const { id } = useParams<{ id: string }>()
  const { presupuesto, loading, error, updatingEstado, updateEstado } = usePresupuesto(id ? Number(id) : null)

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!presupuesto) return <Alert severity="info">Presupuesto no encontrado</Alert>

  const ejecucionPct = presupuesto.montoTotal > 0
    ? Math.round((presupuesto.montoEjecutado / presupuesto.montoTotal) * 100)
    : 0

  const availableTransitions: Record<string, Presupuesto["estado"][]> = {
    BORRADOR: ["APROBADO"],
    APROBADO: ["EJECUTANDO"],
    EJECUTANDO: ["CERRADO"],
    CERRADO: [],
  }

  const nextStates = availableTransitions[presupuesto.estado] || []

  const handleEstadoChange = (nuevoEstado: Presupuesto["estado"]) => {
    updateEstado(presupuesto.id, nuevoEstado)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title={presupuesto.nombre} description={`Período: ${formatDate(presupuesto.periodoInicio)} - ${formatDate(presupuesto.periodoFin)}`} actions={
        <Link to="/app/presupuestos"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm text-stone-500 dark:text-stone-400">Presupuestado</p>
          <p className="text-xl font-bold text-stone-800 dark:text-stone-200">{formatCurrency(presupuesto.montoTotal)}</p>
        </Card>
        <Card>
          <p className="text-sm text-stone-500 dark:text-stone-400">Ejecutado</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(presupuesto.montoEjecutado)}</p>
        </Card>
        <Card>
          <p className="text-sm text-stone-500 dark:text-stone-400">Saldo</p>
          <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{formatCurrency(presupuesto.montoTotal - presupuesto.montoEjecutado)}</p>
        </Card>
        <Card>
          <p className="text-sm text-stone-500 dark:text-stone-400">Estado</p>
          <div className="mt-1"><Badge color={estadoBadge[presupuesto.estado]}>{presupuesto.estado}</Badge></div>
        </Card>
      </div>

      {/* Progress bar */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-stone-700 dark:text-stone-200">Ejecución General</span>
          <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">{ejecucionPct}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${ejecucionPct > 80 ? "bg-emerald-500" : ejecucionPct > 50 ? "bg-amber-500" : "bg-red-500"}`}
            style={{ width: `${ejecucionPct}%` }}
          />
        </div>
      </Card>

      {/* Estado actions */}
      {nextStates.length > 0 && (
        <Card>
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-600 dark:text-stone-300">Cambiar estado a:</span>
            {nextStates.includes("APROBADO") && (
              <Button size="sm" onClick={() => handleEstadoChange("APROBADO")} disabled={updatingEstado}>
                <CheckCircle size={14} />Aprobar
              </Button>
            )}
            {nextStates.includes("EJECUTANDO") && (
              <Button size="sm" onClick={() => handleEstadoChange("EJECUTANDO")} disabled={updatingEstado}>
                <PlayCircle size={14} />Iniciar Ejecución
              </Button>
            )}
            {nextStates.includes("CERRADO") && (
              <Button size="sm" variant="outline" onClick={() => handleEstadoChange("CERRADO")} disabled={updatingEstado}>
                <Lock size={14} />Cerrar
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Partidas */}
      <Card title="Partidas" padding="none">
        <DataTable
          columns={partidaColumns}
          data={presupuesto.partidas}
          loading={false}
          emptyMessage="No hay partidas registradas."
          keyExtractor={(item) => item.id}
        />
      </Card>

      {presupuesto.finca && (
        <Card>
          <p className="text-sm text-stone-500 dark:text-stone-400">Finca asociada</p>
          <p className="font-medium text-stone-700 dark:text-stone-200">{presupuesto.finca.nombre}</p>
        </Card>
      )}
    </div>
  )
}

export default DetallePresupuestoPage
