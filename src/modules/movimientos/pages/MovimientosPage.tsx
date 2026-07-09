import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Pagination } from "@/components/ui/Pagination"
import { Alert } from "@/components/ui/Alert"
import { SearchBar } from "@/components/shared/SearchBar"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useMovimientos } from "../hooks/useMovimientos"
import { useModal } from "@/hooks/useModal"
import { movimientoService } from "../services/movimiento.service"
import { useNotification } from "@/hooks/useNotification"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import type { Movimiento } from "../types/movimiento.types"
import { formatDate } from "@/utils/formatDate"
import { Badge } from "@/components/ui/Badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

const columns: Column<Movimiento>[] = [
  { key: "tipo", header: "Tipo", render: (item) => <Badge color={item.tipo === "ENTRADA" ? "success" : "error"}>{item.tipo}</Badge> },
  {
    key: "producto",
    header: "Producto",
    render: (item) => item.producto?.nombre || "-",
  },
  { key: "cantidad", header: "Cantidad" },
  { key: "unidadMedida", header: "Unidad" },
  {
    key: "fecha",
    header: "Fecha",
    render: (item) => formatDate(item.fecha),
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
      await movimientoService.remove(id)
      notify({ type: "success", title: "Movimiento eliminado", message: "Eliminado correctamente." })
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
      <button onClick={() => navigate(`/app/movimientos/${id}`)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 cursor-pointer"><Edit size={16} /></button>
      <button onClick={confirmModal.open} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"><Trash2 size={16} /></button>
      <ConfirmDialog isOpen={confirmModal.isOpen} onClose={confirmModal.close} onConfirm={handleDelete} title="Eliminar Movimiento" message="¿Estás seguro?" confirmLabel="Eliminar" loading={deleting} />
    </div>
  )
}

function MovimientosPage() {
  const { movimientos, loading, error, pagination, search, setSearch, setPage } = useMovimientos()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Movimientos" description="Control de entradas y salidas de inventario" actions={
        <Link to="/app/movimientos/nuevo"><Button><Plus size={16} />Nuevo Movimiento</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <div className="flex-1 max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Buscar movimientos..." /></div>
      <Card padding="none">
        <DataTable columns={columns} data={movimientos} loading={loading} emptyMessage="No hay movimientos registrados." keyExtractor={(item) => item.id} />
      </Card>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default MovimientosPage
