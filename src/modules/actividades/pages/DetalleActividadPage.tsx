import { useParams, Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { Select } from "@/components/ui/Select"
import { useActividad } from "../hooks/useActividad"
import { actividadService } from "../services/actividades.service"
import { formatDate, formatDateTime } from "@/utils/formatDate"
import { useNotification } from "@/hooks/useNotification"
import { useModal } from "@/hooks/useModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { BackButton } from "@/components/shared/BackButton"
import { Edit, Trash2, Image, Package, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { ESTADO_ACTIVIDAD_OPTIONS } from "../types/actividades.types"
import type { Option } from "@/types"
import { bitacoraService } from "@/modules/bitacora/services/bitacora.service"

const estadoOptions: Option[] = ESTADO_ACTIVIDAD_OPTIONS.map((e) => ({ value: e.value, label: e.label }))

function getEstadoColor(estado: string): "default" | "success" | "warning" | "error" | "info" {
  switch (estado) {
    case "PENDIENTE": return "warning"
    case "EN_PROCESO": return "info"
    case "FINALIZADA": return "success"
    case "CANCELADA": return "error"
    default: return "default"
  }
}

function DetalleActividadPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notify } = useNotification()
  const confirmModal = useModal()
  const [deleting, setDeleting] = useState(false)
  const [updatingEstado, setUpdatingEstado] = useState(false)
  const actividadId = id ? Number(id) : null
  const { actividad, loading, error, refetch } = useActividad(actividadId)

  const handleDelete = async () => {
    if (!actividadId) return
    setDeleting(true)
    try {
      await actividadService.remove(actividadId)
      notify({ type: "success", title: "Actividad eliminada", message: "Actividad eliminada correctamente." })
      confirmModal.close()
      navigate("/app/actividades")
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar la actividad." })
    } finally {
      setDeleting(false)
    }
  }

  const handleEstadoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!actividadId) return
    const nuevoEstado = e.target.value
    setUpdatingEstado(true)
    try {
      await actividadService.updateEstado(actividadId, nuevoEstado)
      notify({ type: "success", title: "Estado actualizado", message: "Estado de la actividad actualizado." })

      // Auto-register in bitacora when finalized
      if (nuevoEstado === "FINALIZADA" && actividad) {
        try {
          await bitacoraService.create({
            fecha: new Date().toISOString().split("T")[0],
            actividad: actividad.titulo || actividad.tipo || "Actividad",
            descripcion: actividad.descripcion || `Actividad finalizada: ${actividad.titulo}`,
            costo: actividad.costo || 0,
            loteId: actividad.loteId || 0,
            cultivoId: actividad.cultivoId || undefined,
            observaciones: "Registrado automáticamente desde la actividad",
          })
          notify({ type: "success", title: "Bitácora actualizada", message: "La actividad se registró en el historial del lote." })
        } catch {
          // Non-critical - bitacora may not be available
        }
      }

      refetch()
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo actualizar el estado." })
    } finally {
      setUpdatingEstado(false)
    }
  }

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!actividad) return <Alert severity="info">Actividad no encontrada</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title={actividad.titulo}
        description="Seguimiento de actividad agrícola"
        actions={
          <div className="flex items-center gap-2">
            <BackButton to="/app/actividades" />
            <Link to={`/app/actividades/${actividad.id}/editar`}>
              <Button variant="outline">
                <Edit size={16} />
                Editar
              </Button>
            </Link>
            <Button variant="danger" onClick={confirmModal.open}>
              <Trash2 size={16} />
              Eliminar
            </Button>
          </div>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Información General">
          <dl className="space-y-3">
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Título</dt><dd className="dark:text-stone-100">{actividad.titulo}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Descripción</dt><dd className="dark:text-stone-100">{actividad.descripcion || "-"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Estado</dt><dd className="dark:text-stone-100"><Badge color={getEstadoColor(actividad.estado)}>{actividad.estado}</Badge></dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Responsable</dt><dd className="dark:text-stone-100">{actividad.responsable?.nombre || `ID: ${actividad.responsableId}`}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Tipo</dt><dd className="dark:text-stone-100">{actividad.tipo || "-"}</dd></div>
          </dl>
        </Card>
        <Card title="Detalles">
          <dl className="space-y-3">
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Fecha de Inicio</dt><dd className="dark:text-stone-100">{actividad.fechaInicio ? formatDate(actividad.fechaInicio) : "-"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Fecha de Fin</dt><dd className="dark:text-stone-100">{actividad.fechaFin ? formatDate(actividad.fechaFin) : "-"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Tiempo Invertido</dt><dd className="dark:text-stone-100">{actividad.tiempoInvertido ? `${actividad.tiempoInvertido} h` : "-"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Costo</dt><dd className="dark:text-stone-100">{actividad.costo ? `$${actividad.costo.toLocaleString()}` : "-"}</dd></div>
            {actividad.finca && <div><dt className="text-sm text-stone-500 dark:text-stone-400">Finca</dt><dd className="dark:text-stone-100">{actividad.finca.nombre}</dd></div>}
            {actividad.lote && <div><dt className="text-sm text-stone-500 dark:text-stone-400">Lote</dt><dd className="dark:text-stone-100">{actividad.lote.nombre}</dd></div>}
            {actividad.cultivo && <div><dt className="text-sm text-stone-500 dark:text-stone-400">Cultivo</dt><dd className="dark:text-stone-100">{actividad.cultivo.nombre}</dd></div>}
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Creado</dt><dd className="dark:text-stone-100">{formatDateTime(actividad.createdAt)}</dd></div>
          </dl>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title={<div className="flex items-center gap-2"><Package size={16} />Productos Utilizados</div>}>
          {actividad.productosUtilizados && actividad.productosUtilizados.length > 0 ? (
            <div className="space-y-2">
              {actividad.productosUtilizados.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-stone-200">
                  <span className="text-sm font-medium">{p.producto?.nombre || `Producto #${p.productoId}`}</span>
                  <span className="text-sm text-stone-500">Cantidad: {p.cantidad}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-400">No se registraron productos.</p>
          )}
        </Card>
        <Card title={<div className="flex items-center gap-2"><Image size={16} />Evidencias</div>}>
          {actividad.evidencias && actividad.evidencias.length > 0 ? (
            <div className="space-y-2">
              {actividad.evidencias.map((ev) => (
                <div key={ev.id} className="p-3 rounded-lg border border-stone-200">
                  <p className="text-sm font-medium">{ev.tipo}</p>
                  {ev.descripcion && <p className="text-xs text-stone-500">{ev.descripcion}</p>}
                  <a href={ev.url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:underline mt-1 inline-block">Ver archivo</a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-400">No hay evidencias registradas.</p>
          )}
        </Card>
      </div>
      <Card title="Cambiar Estado">
        <div className="flex items-center gap-3">
          <Select
            options={estadoOptions}
            value={actividad.estado}
            onChange={handleEstadoChange}
            disabled={updatingEstado}
          />
          {updatingEstado && <Spinner size="sm" />}
        </div>
        {actividad.estado === "FINALIZADA" && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 size={16} />
            <span>Actividad finalizada — registrada en el historial del lote.</span>
          </div>
        )}
      </Card>
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        onConfirm={handleDelete}
        title="Eliminar Actividad"
        message="¿Estás seguro de eliminar esta actividad?"
        confirmLabel="Eliminar"
        loading={deleting}
      />
    </div>
  )
}

export default DetalleActividadPage
