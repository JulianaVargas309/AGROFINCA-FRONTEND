import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Pagination } from "@/components/ui/Pagination"
import { Alert } from "@/components/ui/Alert"
import { Select } from "@/components/ui/Select"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useProducciones } from "../hooks/useProducciones"
import { useModal } from "@/hooks/useModal"
import { produccionService } from "../services/produccion.service"
import { useNotification } from "@/hooks/useNotification"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import type { Produccion } from "../types/produccion.types"
import { formatDate } from "@/utils/formatDate"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { fincaService } from "@/modules/fincas/services/finca.service"

interface FincaOption { id: number; nombre: string }

const columns: Column<Produccion>[] = [
  {
    key: "fecha",
    header: "Fecha",
    render: (item) => formatDate(item.fecha),
  },
  { key: "cultivo", header: "Cultivo", render: (item) => item.cultivo?.nombre || "-" },
  { key: "lote", header: "Lote", render: (item) => item.lote?.nombre || "-" },
  { key: "temporada", header: "Temporada", render: (item) => item.temporada?.nombre || "-" },
  {
    key: "cantidad",
    header: "Cantidad",
    render: (item) => `${item.cantidad} ${item.unidad || ""}`,
  },
  { key: "calidad", header: "Calidad", render: (item) => item.calidad || "-" },
  {
    key: "acciones",
    header: "",
    className: "w-[100px]",
    render: (item) => <Actions id={item.id} />,
  },
]

function Actions({ id }: { id: number }) {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const confirmModal = useModal()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await produccionService.remove(id)
      notify({ type: "success", title: "Registro eliminado", message: "Producción eliminada correctamente." })
      confirmModal.close()
      window.location.reload()
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar el registro." })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => navigate(`/app/produccion/${id}`)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 cursor-pointer">
        <Edit size={16} />
      </button>
      <button onClick={confirmModal.open} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer">
        <Trash2 size={16} />
      </button>
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        onConfirm={handleDelete}
        title="Eliminar Producción"
        message="¿Estás seguro de eliminar este registro?"
        confirmLabel="Eliminar"
        loading={deleting}
      />
    </div>
  )
}

function ProduccionPage() {
  const { producciones, loading, error, pagination, filters, setFilter, clearFilters, setPage } = useProducciones()
  const [fincas, setFincas] = useState<FincaOption[]>([])

  useEffect(() => {
    fincaService.findAll().then((res) => {
      const list = Array.isArray(res) ? res : (res as { data: FincaOption[] }).data
      setFincas(list ?? [])
    }).catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Producción"
        description="Historial de producción y cosechas"
        actions={
          <Link to="/app/produccion/nuevo">
            <Button>
              <Plus size={16} />
              Nueva Producción
            </Button>
          </Link>
        }
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <div className="flex flex-wrap items-end gap-3">
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
          {(filters.fechaDesde || filters.fechaHasta || filters.cultivoId) && (
            <button onClick={clearFilters} className="rounded-lg px-3 py-2 text-sm text-stone-500 hover:bg-stone-100 cursor-pointer">
              Limpiar
            </button>
          )}
        </div>
      </Card>
      <Card padding="none">
        <DataTable columns={columns} data={producciones} loading={loading} emptyMessage="No hay registros de producción." keyExtractor={(item) => item.id} />
      </Card>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default ProduccionPage
