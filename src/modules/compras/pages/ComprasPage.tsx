import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Pagination } from "@/components/ui/Pagination"
import { Alert } from "@/components/ui/Alert"
import { SearchBar } from "@/components/shared/SearchBar"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useCompras } from "../hooks/useCompras"
import { useModal } from "@/hooks/useModal"
import { compraService } from "../services/compra.service"
import { useNotification } from "@/hooks/useNotification"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import type { Compra } from "../types/compras.types"
import { formatDate } from "@/utils/formatDate"
import { formatCurrency } from "@/utils/formatCurrency"
import { Badge } from "@/components/ui/Badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

const estadoColors: Record<string, string> = {
  PENDIENTE: "warning",
  COMPLETADA: "success",
  ANULADA: "error",
}

const columns: Column<Compra>[] = [
  { key: "numeroFactura", header: "Factura", render: (item) => item.numeroFactura || "-" },
  { key: "fecha", header: "Fecha", render: (item) => formatDate(item.fecha) },
  { key: "proveedor", header: "Proveedor", render: (item) => item.proveedor?.nombre || "-" },
  { key: "total", header: "Total", render: (item) => <span className="font-medium">{formatCurrency(item.total)}</span> },
  {
    key: "estado",
    header: "Estado",
    render: (item) => (
      <Badge color={estadoColors[item.estado] || "default"}>{item.estado}</Badge>
    ),
  },
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
      await compraService.remove(id)
      notify({ type: "success", title: "Compra eliminada", message: "Compra eliminada correctamente." })
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
      <button onClick={() => navigate(`/app/compras/${id}`)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 cursor-pointer"><Edit size={16} /></button>
      <button onClick={confirmModal.open} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"><Trash2 size={16} /></button>
      <ConfirmDialog isOpen={confirmModal.isOpen} onClose={confirmModal.close} onConfirm={handleDelete} title="Eliminar Compra" message="¿Estás seguro?" confirmLabel="Eliminar" loading={deleting} />
    </div>
  )
}

function ComprasPage() {
  const { compras, loading, error, pagination, search, setSearch, setPage } = useCompras()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Compras" description="Gestión de compras e insumos" actions={
        <Link to="/app/compras/nueva"><Button><Plus size={16} />Nueva Compra</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <div className="flex-1 max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Buscar compras..." /></div>
      <Card padding="none">
        <DataTable columns={columns} data={compras} loading={loading} emptyMessage="No hay compras registradas." keyExtractor={(item) => item.id} />
      </Card>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default ComprasPage
