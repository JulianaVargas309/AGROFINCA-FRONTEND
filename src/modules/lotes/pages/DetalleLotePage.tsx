import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { Spinner } from "@/components/ui/Spinner"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { LoteForm } from "../components/LoteForm"
import { useLote } from "../hooks/useLote"
import { useModal } from "@/hooks/useModal"
import { useNotification } from "@/hooks/useNotification"
import { ROUTES } from "@/constants/routes"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate, formatDateTime } from "@/utils/formatDate"
import type { UpdateLoteFormData } from "../schemas/lote.schema"
import {
  Sprout, Ruler, Edit, Trash2, ArrowLeft,
  DollarSign, ClipboardList, Users, Leaf,
  Calendar, History, TrendingUp, Camera, FileText,
  MapPin, Tractor, Sun, Package,
} from "lucide-react"
import { calendarioService } from "@/modules/calendario/services/calendario.service"
import type { EventoCalendario } from "@/modules/calendario/types/calendario.types"

type TabId = "general" | "calendario" | "bitacora" | "produccion" | "historial"

const tabs: { id: TabId; label: string; icon: typeof Sprout }[] = [
  { id: "general", label: "General", icon: MapPin },
  { id: "calendario", label: "Calendario", icon: Calendar },
  { id: "bitacora", label: "Bitácora", icon: ClipboardList },
  { id: "produccion", label: "Producción", icon: TrendingUp },
  { id: "historial", label: "Historial", icon: History },
]

function DetalleLotePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const loteId = id ? Number(id) : null
  const { data, loading, error, saving, deleting, updateLote, deleteLote } = useLote(loteId)
  const { notify } = useNotification()
  const editModal = useModal()
  const deleteModal = useModal()
  const [editError, setEditError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>("general")
  const [eventos, setEventos] = useState<EventoCalendario[]>([])
  const [eventosLoading, setEventosLoading] = useState(false)

  useEffect(() => {
    if (!loteId || activeTab !== "calendario") return
    setEventosLoading(true)
    calendarioService.findAll({ loteId }).then(setEventos).catch(() => {}).finally(() => setEventosLoading(false))
  }, [loteId, activeTab])

  const handleUpdate = async (formData: UpdateLoteFormData) => {
    if (!loteId) return
    setEditError(null)
    try {
      await updateLote(loteId, formData)
      notify({ type: "success", title: "Lote actualizado", message: "Los cambios fueron guardados." })
      editModal.close()
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Error al actualizar")
    }
  }

  const handleDelete = async () => {
    if (!loteId) return
    try {
      await deleteLote(loteId)
      notify({ type: "success", title: "Lote eliminado", message: "El lote fue desactivado." })
      navigate(ROUTES.LOTES)
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar." })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </div>
    )
  }

  if (!data.lote) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <Alert severity="error">Lote no encontrado.</Alert>
        <Link to={ROUTES.LOTES}><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      </div>
    )
  }

  const lote = data.lote

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title={lote.nombre}
        description={lote.descripcion ?? `Lote registrado el ${formatDate(lote.createdAt)}`}
        actions={
          <div className="flex gap-2">
            <Link to="/app/lotes"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
            <Button variant="outline" onClick={editModal.open}><Edit size={16} />Editar</Button>
            <Button variant="danger" onClick={deleteModal.open}><Trash2 size={16} />Eliminar</Button>
          </div>
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-emerald-600 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400"
                  : "border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:border-stone-600"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab: General */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lote.area && (
              <Card>
                <div className="flex items-center gap-2 text-stone-500 mb-1 dark:text-stone-400"><Ruler size={16} /><span className="text-xs font-medium">Área</span></div>
                <p className="text-lg font-bold text-stone-900 dark:text-stone-100">{lote.area} ha</p>
              </Card>
            )}
            <Card>
              <div className="flex items-center gap-2 text-stone-500 mb-1 dark:text-stone-400"><DollarSign size={16} /><span className="text-xs font-medium">Costos Totales</span></div>
              <p className="text-lg font-bold text-stone-900 dark:text-stone-100">{formatCurrency(data.costoTotal)}</p>
            </Card>
            <Card>
              <div className="flex items-center gap-2 text-stone-500 mb-1 dark:text-stone-400"><ClipboardList size={16} /><span className="text-xs font-medium">Actividades</span></div>
              <p className="text-lg font-bold text-stone-900 dark:text-stone-100">{data.bitacoras.length}</p>
            </Card>
            <Card>
              <div className="flex items-center gap-2 text-stone-500 mb-1 dark:text-stone-400"><Users size={16} /><span className="text-xs font-medium">Jornales</span></div>
              <p className="text-lg font-bold text-stone-900 dark:text-stone-100">{data.jornales.length}</p>
            </Card>
          </div>

          <Card title="Cultivos">
            {data.cultivos.length === 0 ? (
              <div className="py-6 text-center">
                <Sprout size={28} className="mx-auto text-stone-300 dark:text-stone-600" />
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">No hay cultivos registrados en este lote.</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100 dark:divide-stone-800 -mx-5">
                {data.cultivos.map((c) => (
                  <div key={c.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-stone-700 dark:text-stone-200">{c.nombre}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{c.tipo} · Siembra: {formatDate(c.fechaSiembra)}</p>
                    </div>
                    <Badge color={c.estado === "ACTIVO" ? "success" : c.estado === "COSECHADO" ? "info" : "error"}>
                      {c.estado}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Resumen de Costos">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                <p className="text-xs text-purple-600 mb-1 dark:text-purple-400">Actividades (Bitácora)</p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{formatCurrency(data.costoBitacora)}</p>
              </div>
              <div className="rounded-lg bg-sky-50 p-3 dark:bg-sky-900/20">
                <p className="text-xs text-sky-600 mb-1 dark:text-sky-400">Jornales</p>
                <p className="text-lg font-bold text-sky-700 dark:text-sky-300">{formatCurrency(data.costoJornales)}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Calendar */}
      {activeTab === "calendario" && (
        <Card title="Eventos del Calendario">
          {eventosLoading ? (
            <Spinner />
          ) : eventos.length === 0 ? (
            <div className="py-8 text-center">
              <Calendar size={32} className="mx-auto text-stone-300 dark:text-stone-600" />
              <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">No hay eventos programados para este lote.</p>
              <Link to="/app/calendario/nuevo">
                <Button variant="outline" size="sm" className="mt-3">Programar Evento</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {eventos.map((ev) => (
                <Link
                  key={ev.id}
                  to={`/app/calendario/${ev.id}`}
                  className="block p-3 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-emerald-300 hover:bg-emerald-50 transition-colors dark:hover:border-emerald-700 dark:hover:bg-emerald-900/20"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-stone-900 dark:text-stone-100">{ev.titulo}</span>
                    <Badge color={ev.prioridad === "CRITICA" ? "error" : ev.prioridad === "ALTA" ? "warning" : "default"}>
                      {ev.prioridad}
                    </Badge>
                  </div>
                  {ev.descripcion && <p className="text-xs text-stone-500 dark:text-stone-400">{ev.descripcion}</p>}
                  <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">{formatDateTime(ev.fechaInicio)}</p>
                </Link>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Tab: Bitácora */}
      {activeTab === "bitacora" && (
        <Card title="Bitácora - Actividades del Lote">
          {data.bitacoras.length === 0 ? (
            <div className="py-8 text-center">
              <ClipboardList size={32} className="mx-auto text-stone-300 dark:text-stone-600" />
              <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">No hay actividades registradas en la bitácora para este lote.</p>
              <Link to="/app/bitacora/nueva">
                <Button variant="outline" size="sm" className="mt-3">Registrar Actividad</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.bitacoras.map((b) => (
                <div key={b.id} className="flex items-start gap-3 p-3 rounded-lg border border-stone-200 dark:border-stone-800">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-stone-700 dark:text-stone-200">{b.actividad}</p>
                      {b.cultivo && <Badge>{b.cultivo.nombre}</Badge>}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-2 dark:text-stone-400">{b.descripcion}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-stone-400 dark:text-stone-500">
                      <span>{formatDate(b.fecha)}</span>
                      {b.costo > 0 && <span className="text-red-500 font-medium dark:text-red-400">{formatCurrency(b.costo)}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Tab: Producción */}
      {activeTab === "produccion" && (
        <div className="space-y-6">
          <Card title="Cultivos">
            {data.cultivos.length === 0 ? (
              <div className="py-8 text-center">
                <Tractor size={32} className="mx-auto text-stone-300 dark:text-stone-600" />
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">No hay cultivos registrados.</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100 -mx-5 dark:divide-stone-800">
                {data.cultivos.map((c) => (
                  <div key={c.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <Leaf size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-700 dark:text-stone-200">{c.nombre}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{c.tipo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge color={c.estado === "ACTIVO" ? "success" : c.estado === "COSECHADO" ? "info" : "error"}>
                        {c.estado}
                      </Badge>
                      <p className="text-xs text-stone-400 mt-0.5 dark:text-stone-500">Siembra: {formatDate(c.fechaSiembra)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Tab: Historial */}
      {activeTab === "historial" && (
        <div className="space-y-6">
          <Card title="Jornales">
            {data.jornales.length === 0 ? (
              <div className="py-6 text-center">
                <Users size={28} className="mx-auto text-stone-300 dark:text-stone-600" />
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">No hay jornales registrados.</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100 -mx-5 dark:divide-stone-800">
                {data.jornales.map((j) => (
                  <div key={j.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm text-stone-700 dark:text-stone-200">{j.trabajador.nombre}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{j.tipoPago === "KILO" ? "Destajo" : "Día"} · {formatDate(j.fecha)}</p>
                    </div>
                    {j.total ? (
                      <span className="text-sm font-medium text-stone-700 dark:text-stone-200">{formatCurrency(j.total)}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Historial de Costos">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                <p className="text-xs text-purple-600 mb-1 dark:text-purple-400">Bitácora</p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{formatCurrency(data.costoBitacora)}</p>
              </div>
              <div className="rounded-lg bg-sky-50 p-3 dark:bg-sky-900/20">
                <p className="text-xs text-sky-600 mb-1 dark:text-sky-400">Jornales</p>
                <p className="text-lg font-bold text-sky-700 dark:text-sky-300">{formatCurrency(data.costoJornales)}</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-3 col-span-2 dark:bg-amber-900/20">
                <p className="text-xs text-amber-600 mb-1 dark:text-amber-400">Costo Total</p>
                <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{formatCurrency(data.costoTotal)}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={editModal.close} />
          <div className="relative z-10 mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-auto dark:bg-stone-900">
            <h2 className="text-lg font-semibold text-stone-900 mb-4 dark:text-stone-100">Editar Lote</h2>
            <LoteForm
              mode="edit"
              defaultValues={data.lote ?? {}}
              onSubmit={handleUpdate}
              loading={saving}
              error={editError}
              onClearError={() => setEditError(null)}
              submitLabel="Guardar Cambios"
              showFincaSelector={false}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleDelete}
        title="Eliminar Lote"
        message={`¿Eliminar "${lote.nombre}"? Será desactivado.`}
        loading={deleting}
      />
    </div>
  )
}

export default DetalleLotePage
