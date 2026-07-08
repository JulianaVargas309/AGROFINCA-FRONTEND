import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { Select } from "@/components/ui/Select"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { EmptyState } from "@/components/shared/EmptyState"
import { useBitacora } from "../hooks/useBitacora"
import { useModal } from "@/hooks/useModal"
import { useNotification } from "@/hooks/useNotification"
import { bitacoraService } from "../services/bitacora.service"
import { ACTIVIDAD_OPTIONS } from "../schemas/bitacora.schema"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import { Plus, Edit, Trash2, ClipboardList, Sprout, MapPin, Calendar } from "lucide-react"
import { useState } from "react"

function BitacoraPage() {
  const navigate = useNavigate()
  const { registros, lotes, cultivos, loading, error, filters, setFilter, clearFilters } = useBitacora(20)
  const { notify } = useNotification()
  const deleteModal = useModal()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!selectedId) return
    setDeleting(true)
    try {
      await bitacoraService.remove(selectedId)
      notify({ type: "success", title: "Registro eliminado" })
      deleteModal.close()
      window.location.reload()
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar." })
    } finally { setDeleting(false) }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Bitácora"
        description="Registro de actividades del cultivo"
        actions={
          <Link to="/app/bitacora/nueva">
            <Button><Plus size={16} />Nueva Actividad</Button>
          </Link>
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <Select
            value={filters.loteId ? String(filters.loteId) : ""}
            onChange={(e) => setFilter("loteId", e.target.value ? Number(e.target.value) : undefined)}
            options={lotes.map((l) => ({ value: String(l.id), label: l.nombre }))}
            placeholder="Todos los lotes"
            className="min-w-[180px]"
          />
          {cultivos.length > 0 && (
            <Select
              value={filters.cultivoId ? String(filters.cultivoId) : ""}
              onChange={(e) => setFilter("cultivoId", e.target.value ? Number(e.target.value) : undefined)}
              options={cultivos.map((c) => ({ value: String(c.id), label: c.nombre }))}
              placeholder="Todos los cultivos"
              className="min-w-[180px]"
            />
          )}
          <Select
            value={filters.actividad ?? ""}
            onChange={(e) => setFilter("actividad", e.target.value || undefined)}
            options={ACTIVIDAD_OPTIONS}
            placeholder="Todas las actividades"
            className="min-w-[180px]"
          />
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.fechaDesde ?? ""}
              onChange={(e) => setFilter("fechaDesde", e.target.value || undefined)}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-stone-400 text-sm">-</span>
            <input
              type="date"
              value={filters.fechaHasta ?? ""}
              onChange={(e) => setFilter("fechaHasta", e.target.value || undefined)}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {(filters.loteId || filters.cultivoId || filters.actividad || filters.fechaDesde) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>Limpiar</Button>
            )}
          </div>
        </div>
      </Card>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <ClipboardList size={40} className="animate-pulse text-stone-300" />
        </div>
      ) : registros.length === 0 ? (
        <EmptyState title="Sin registros" description="No hay actividades en la bitácora con los filtros actuales." />
      ) : (
        <div className="space-y-3">
          {registros.map((r) => (
            <Card key={r.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/app/bitacora/${r.id}`)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-stone-900">{r.actividad}</h3>
                    <Badge>{(r.actividad?.charAt(0) ?? "") + (r.actividad?.slice(1).toLowerCase().replace(/_/g, " ") ?? "")}</Badge>
                    {r.lote && (
                      <span className="flex items-center gap-1 text-xs text-stone-500">
                        <MapPin size={12} />{r.lote.nombre}
                      </span>
                    )}
                    {r.cultivo && (
                      <span className="flex items-center gap-1 text-xs text-stone-500">
                        <Sprout size={12} />{r.cultivo.nombre}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-stone-600 mt-1 line-clamp-2">{r.descripcion}</p>
                  <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                    <Calendar size={12} />{formatDate(r.fecha)} · {r.user?.nombre}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {r.costo > 0 && <p className="text-sm font-bold text-red-600">{formatCurrency(r.costo)}</p>}
                  {r.cantidad && <p className="text-xs text-stone-500">{r.cantidad} {r.unidadMedida || ""}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => navigate(`/app/bitacora/${r.id}`)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 cursor-pointer"><Edit size={16} /></button>
                  <button onClick={() => { setSelectedId(r.id); deleteModal.open() }} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"><Trash2 size={16} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog isOpen={deleteModal.isOpen} onClose={deleteModal.close} onConfirm={handleDelete} title="Eliminar Registro" message="¿Eliminar este registro de la bitácora?" loading={deleting} />
    </div>
  )
}

export default BitacoraPage
