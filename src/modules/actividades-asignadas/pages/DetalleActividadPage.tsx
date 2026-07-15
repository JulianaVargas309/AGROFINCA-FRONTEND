import { useParams, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { useActividadAsignada } from "../hooks/useActividadAsignada"
import { formatDate } from "@/utils/formatDate"
import { ArrowLeft } from "lucide-react"

const estadoColors: Record<string, string> = {
  PENDIENTE: "warning",
  EN_PROGRESO: "info",
  COMPLETADA: "success",
  CANCELADA: "error",
}

const prioridadColors: Record<string, string> = {
  BAJA: "default",
  MEDIA: "info",
  ALTA: "warning",
  URGENTE: "error",
}

function DetalleActividadPage() {
  const { id } = useParams<{ id: string }>()
  const { actividad, loading, error } = useActividadAsignada(id ? Number(id) : null)

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!actividad) return <Alert severity="info">Actividad no encontrada</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title={actividad.titulo} description={`Prioridad: ${actividad.prioridad}`} actions={
        <Link to="/app/actividades-asignadas"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Información General">
          <dl className="space-y-3">
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Título</dt><dd className="dark:text-stone-100">{actividad.titulo}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Descripción</dt><dd className="dark:text-stone-100">{actividad.descripcion || "-"}</dd></div>
            <div>
              <dt className="text-sm text-stone-500 dark:text-stone-400">Estado</dt>
              <dd className="mt-1"><Badge color={estadoColors[actividad.estado] || "default"}>{actividad.estado}</Badge></dd>
            </div>
            <div>
              <dt className="text-sm text-stone-500 dark:text-stone-400">Prioridad</dt>
              <dd className="mt-1"><Badge color={prioridadColors[actividad.prioridad] || "default"}>{actividad.prioridad}</Badge></dd>
            </div>
          </dl>
        </Card>
        <Card title="Fechas y Asignación">
          <dl className="space-y-3">
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Trabajador</dt><dd className="dark:text-stone-100">{actividad.trabajador?.nombre || "-"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Fecha de Asignación</dt><dd className="dark:text-stone-100">{formatDate(actividad.fechaAsignacion)}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Fecha de Inicio</dt><dd className="dark:text-stone-100">{actividad.fechaInicio ? formatDate(actividad.fechaInicio) : "-"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Fecha de Fin</dt><dd className="dark:text-stone-100">{actividad.fechaFin ? formatDate(actividad.fechaFin) : "-"}</dd></div>
          </dl>
        </Card>
        <Card title="Ubicación">
          <dl className="space-y-3">
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Lote</dt><dd className="dark:text-stone-100">{actividad.lote?.nombre || "-"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Cultivo</dt><dd className="dark:text-stone-100">{actividad.cultivo?.nombre || "-"}</dd></div>
          </dl>
        </Card>
      </div>
    </div>
  )
}

export default DetalleActividadPage
