import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Pagination } from "@/components/ui/Pagination"
import { Alert } from "@/components/ui/Alert"
import { SearchBar } from "@/components/shared/SearchBar"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useGastos } from "../hooks/useGastos"
import { useModal } from "@/hooks/useModal"
import { gastoService } from "../services/gasto.service"
import { useNotification } from "@/hooks/useNotification"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import type { Gasto } from "../types/gasto.types"
import { formatDate } from "@/utils/formatDate"
import { formatCurrency } from "@/utils/formatCurrency"
import { Badge } from "@/components/ui/Badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

const columns: Column<Gasto>[] = [
  { key: "fecha", header: "Fecha", render: (item) => formatDate(item.fecha) },
  { key: "categoria", header: "Categoría", render: (item) => <Badge color="default">{item.categoria}</Badge> },
  { key: "descripcion", header: "Descripción" },
  { key: "monto", header: "Monto", render: (item) => <span className="font-medium text-red-600">{formatCurrency(item.monto)}</span> },
  { key: "proveedor", header: "Proveedor", render: (item) => item.proveedor || "-" },
  { key: "lote", header: "Lote", render: (item) => item.lote?.nombre || "-" },
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
      await gastoService.remove(id)
      notify({ type: "success", title: "Gasto eliminado", message: "Gasto eliminado correctamente." })
      confirmModal.close()
      window.location.reload()
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar." })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => navigate(`/app/gastos/${id}`)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 cursor-pointer"><Edit size={16} /></button>
      <button onClick={confirmModal.open} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"><Trash2 size={16} /></button>
      <ConfirmDialog isOpen={confirmModal.isOpen} onClose={confirmModal.close} onConfirm={handleDelete} title="Eliminar Gasto" message="¿Estás seguro?" confirmLabel="Eliminar" loading={deleting} />
    </div>
  )
}

function GastosPage() {
  const { gastos, loading, error, pagination, search, setSearch, setPage } = useGastos()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Gastos" description="Control de gastos operativos" actions={
        <Link to="/app/gastos/nuevo"><Button><Plus size={16} />Nuevo Gasto</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <div className="flex-1 max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Buscar gastos..." /></div>
      <Card padding="none">
        <DataTable columns={columns} data={gastos} loading={loading} emptyMessage="No hay gastos registrados." keyExtractor={(item) => item.id} />
      </Card>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default GastosPage
