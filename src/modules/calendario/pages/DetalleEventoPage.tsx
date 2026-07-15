import { useParams, Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { useEventoCalendario } from "../hooks/useEventoCalendario"
import { calendarioService } from "../services/calendario.service"
import { TIPO_EVENTO_OPTIONS, PRIORIDAD_OPTIONS } from "../types/calendario.types"
import { formatDate, formatDateTime } from "@/utils/formatDate"
import { useNotification } from "@/hooks/useNotification"
import { useModal } from "@/hooks/useModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { BackButton } from "@/components/shared/BackButton"
import { Edit, Trash2, Bell } from "lucide-react"
import { useState, useEffect } from "react"
import { recordatorioService } from "../services/recordatorio.service"
import type { Recordatorio } from "../types/calendario.types"

function DetalleEventoPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notify } = useNotification()
  const confirmModal = useModal()
  const [deleting, setDeleting] = useState(false)
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([])
  const eventoId = id ? Number(id) : null
  const { evento, loading, error } = useEventoCalendario(eventoId)

  useEffect(() => {
    if (!eventoId) return
    recordatorioService.findAll(eventoId).then(setRecordatorios).catch(() => {})
  }, [eventoId])

  const handleDelete = async () => {
    if (!eventoId) return
    setDeleting(true)
    try {
      await calendarioService.remove(eventoId)
      notify({ type: "success", title: "Evento eliminado", message: "Evento eliminado correctamente." })
      confirmModal.close()
      navigate("/app/calendario")
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar el evento." })
    } finally {
      setDeleting(false)
    }
  }

  const tipoInfo = TIPO_EVENTO_OPTIONS.find((t) => t.value === evento?.tipo)
  const prioridadInfo = PRIORIDAD_OPTIONS.find((p) => p.value === evento?.prioridad)

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!evento) return <Alert severity="info">Evento no encontrado</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title={evento.titulo}
        description={`${tipoInfo?.label || evento.tipo} - ${prioridadInfo?.label || evento.prioridad}`}
        actions={
          <div className="flex items-center gap-2">
            <BackButton to="/app/calendario" />
            <Link to={`/app/calendario/${evento.id}/editar`}>
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
        <Card title="Información del Evento">
          <dl className="space-y-3">
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Título</dt><dd className="dark:text-stone-100">{evento.titulo}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Descripción</dt><dd>{evento.descripcion || "-"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Tipo</dt><dd><Badge>{tipoInfo?.label || evento.tipo}</Badge></dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Prioridad</dt><dd><Badge color={evento.prioridad === "CRITICA" ? "error" : evento.prioridad === "ALTA" ? "warning" : evento.prioridad === "MEDIA" ? "info" : "default"}>{evento.prioridad}</Badge></dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Estado</dt><dd><Badge color="success">{evento.estado}</Badge></dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Ubicación</dt><dd>{evento.ubicacion || "-"}</dd></div>
          </dl>
        </Card>
        <Card title="Fecha y Relaciones">
          <dl className="space-y-3">
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Fecha de Inicio</dt><dd>{formatDateTime(evento.fechaInicio)}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Fecha de Fin</dt><dd>{evento.fechaFin ? formatDateTime(evento.fechaFin) : "-"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Todo el día</dt><dd>{evento.todoElDia ? "Sí" : "No"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Finca</dt><dd>{evento.finca?.nombre || "-"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Lote</dt><dd>{evento.lote?.nombre || "-"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Cultivo</dt><dd>{evento.cultivo?.nombre || "-"}</dd></div>
          </dl>
        </Card>
      </div>
      <Card title={<div className="flex items-center gap-2"><Bell size={16} />Recordatorios</div>}>
        {recordatorios.length === 0 ? (
          <p className="text-sm text-stone-400 dark:text-stone-500">No hay recordatorios para este evento.</p>
        ) : (
          <div className="space-y-2">
            {recordatorios.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border border-stone-200 dark:border-stone-700">
                <div>
                  <p className="text-sm font-medium">{r.titulo}</p>
                  {r.mensaje && <p className="text-xs text-stone-500 dark:text-stone-400">{r.mensaje}</p>}
                  <p className="text-xs text-stone-400 dark:text-stone-500">{formatDate(r.fecha)}</p>
                </div>
                <Badge color={r.enviado ? "success" : "warning"}>{r.enviado ? "Enviado" : "Pendiente"}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        onConfirm={handleDelete}
        title="Eliminar Evento"
        message="¿Estás seguro de eliminar este evento?"
        confirmLabel="Eliminar"
        loading={deleting}
      />
    </div>
  )
}

export default DetalleEventoPage
