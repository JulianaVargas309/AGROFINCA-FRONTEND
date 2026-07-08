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
import { formatDate } from "@/utils/formatDate"
import type { UpdateLoteFormData } from "../schemas/lote.schema"
import {
  Sprout, Ruler, Edit, Trash2, ArrowLeft,
  DollarSign, ClipboardList, Users, Leaf,
} from "lucide-react"
import { useState } from "react"

function DetalleLotePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const loteId = id ? Number(id) : null
  const { data, loading, error, saving, deleting, updateLote, deleteLote } = useLote(loteId)
  const { notify } = useNotification()
  const editModal = useModal()
  const deleteModal = useModal()
  const [editError, setEditError] = useState<string | null>(null)

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

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title={data.lote.nombre}
        description={data.lote.descripcion ?? `Lote registrado el ${formatDate(data.lote.createdAt)}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={editModal.open}><Edit size={16} />Editar</Button>
            <Button variant="danger" onClick={deleteModal.open}><Trash2 size={16} />Eliminar</Button>
          </div>
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.lote.area && (
          <Card>
            <div className="flex items-center gap-2 text-stone-500 mb-1"><Ruler size={16} /><span className="text-xs font-medium">Área</span></div>
            <p className="text-lg font-bold text-stone-900">{data.lote.area} ha</p>
          </Card>
        )}
        <Card>
          <div className="flex items-center gap-2 text-stone-500 mb-1"><DollarSign size={16} /><span className="text-xs font-medium">Costos Totales</span></div>
          <p className="text-lg font-bold text-stone-900">{formatCurrency(data.costoTotal)}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-stone-500 mb-1"><ClipboardList size={16} /><span className="text-xs font-medium">Actividades</span></div>
          <p className="text-lg font-bold text-stone-900">{data.bitacoras.length}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-stone-500 mb-1"><Users size={16} /><span className="text-xs font-medium">Jornales</span></div>
          <p className="text-lg font-bold text-stone-900">{data.jornales.length}</p>
        </Card>
      </div>

      {/* Cultivos */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-2">
            <Leaf size={16} className="text-emerald-600" />Cultivos
          </h3>
          <Badge color="info">{data.cultivos.length}</Badge>
        </div>
        {data.cultivos.length === 0 ? (
          <div className="py-6 text-center">
            <Sprout size={28} className="mx-auto text-stone-300" />
            <p className="mt-2 text-sm text-stone-500">No hay cultivos registrados en este lote.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 -mx-5">
            {data.cultivos.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-stone-700">{c.nombre}</p>
                  <p className="text-xs text-stone-500">{c.tipo} · Siembra: {formatDate(c.fechaSiembra)}</p>
                </div>
                <Badge color={c.estado === "ACTIVO" ? "success" : c.estado === "COSECHADO" ? "info" : "error"}>
                  {c.estado}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Actividades (Bitácora) */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-2">
            <ClipboardList size={16} className="text-purple-600" />Actividades Recientes
          </h3>
        </div>
        {data.bitacoras.length === 0 ? (
          <div className="py-6 text-center">
            <ClipboardList size={28} className="mx-auto text-stone-300" />
            <p className="mt-2 text-sm text-stone-500">No hay actividades registradas.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 -mx-5">
            {data.bitacoras.map((b) => (
              <div key={b.id} className="flex items-start justify-between px-5 py-3 gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-stone-700 truncate">{b.actividad}</p>
                    {b.cultivo && <Badge>{b.cultivo.nombre}</Badge>}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{b.descripcion}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{formatDate(b.fecha)}</p>
                </div>
                {b.costo > 0 && (
                  <span className="text-sm font-medium text-red-600 shrink-0">{formatCurrency(b.costo)}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Jornales */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-2">
            <Users size={16} className="text-sky-600" />Jornales
          </h3>
          <span className="text-xs text-stone-500">
            Total: <span className="font-semibold text-stone-700">{formatCurrency(data.costoJornales)}</span>
          </span>
        </div>
        {data.jornales.length === 0 ? (
          <div className="py-6 text-center">
            <Users size={28} className="mx-auto text-stone-300" />
            <p className="mt-2 text-sm text-stone-500">No hay jornales registrados.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 -mx-5">
            {data.jornales.slice(0, 5).map((j) => (
              <div key={j.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm text-stone-700">{j.trabajador.nombre}</p>
                  <p className="text-xs text-stone-500">{j.tarea || "Sin tarea"} · {formatDate(j.fecha)}</p>
                </div>
                {j.montoPagado ? (
                  <span className="text-sm font-medium text-stone-700">{formatCurrency(j.montoPagado)}</span>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Costos */}
      <Card>
        <h3 className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
          <DollarSign size={16} className="text-red-600" />Resumen de Costos
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-purple-50 p-3">
            <p className="text-xs text-purple-600 mb-1">Actividades (Bitácora)</p>
            <p className="text-lg font-bold text-purple-700">{formatCurrency(data.costoBitacora)}</p>
          </div>
          <div className="rounded-lg bg-sky-50 p-3">
            <p className="text-xs text-sky-600 mb-1">Jornales</p>
            <p className="text-lg font-bold text-sky-700">{formatCurrency(data.costoJornales)}</p>
          </div>
        </div>
      </Card>

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={editModal.close} />
          <div className="relative z-10 mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Editar Lote</h2>
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
        message={`¿Eliminar "${data.lote.nombre}"? Será desactivado.`}
        loading={deleting}
      />
    </div>
  )
}

export default DetalleLotePage
