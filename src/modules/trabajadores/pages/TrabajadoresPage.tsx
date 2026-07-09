import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Pagination } from "@/components/ui/Pagination"
import { Alert } from "@/components/ui/Alert"
import { SearchBar } from "@/components/shared/SearchBar"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useTrabajadores } from "../hooks/useTrabajadores"
import { useModal } from "@/hooks/useModal"
import { trabajadorService } from "../services/trabajador.service"
import { useNotification } from "@/hooks/useNotification"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import type { Trabajador } from "../types/trabajador.types"
import { Badge } from "@/components/ui/Badge"
import { formatDate } from "@/utils/formatDate"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

const columns: Column<Trabajador>[] = [
  {
    key: "nombre",
    header: "Nombre",
    render: (item) => (
      <Link to={`/app/trabajadores/${item.id}`} className="font-medium text-emerald-700 hover:text-emerald-800">{item.nombre}</Link>
    ),
  },
  { key: "documento", header: "Documento" },
  { key: "cargo", header: "Cargo" },
  { key: "telefono", header: "Teléfono", render: (item) => item.telefono || "-" },
  { key: "fechaIngreso", header: "Ingreso", render: (item) => formatDate(item.fechaIngreso) },
  {
    key: "activo",
    header: "Estado",
    render: (item) => <Badge color={item.activo ? "success" : "default"}>{item.activo ? "Activo" : "Inactivo"}</Badge>,
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
      await trabajadorService.remove(id)
      notify({ type: "success", title: "Trabajador eliminado", message: "Trabajador desactivado." })
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
      <button onClick={() => navigate(`/app/trabajadores/${id}`)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 cursor-pointer"><Edit size={16} /></button>
      <button onClick={confirmModal.open} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"><Trash2 size={16} /></button>
      <ConfirmDialog isOpen={confirmModal.isOpen} onClose={confirmModal.close} onConfirm={handleDelete} title="Eliminar Trabajador" message="¿Estás seguro?" confirmLabel="Eliminar" loading={deleting} />
    </div>
  )
}

function TrabajadoresPage() {
  const { trabajadores, loading, error, pagination, search, setSearch, setPage } = useTrabajadores()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Trabajadores" description="Gestiona los trabajadores de la finca" actions={
        <Link to="/app/trabajadores/nuevo"><Button><Plus size={16} />Nuevo Trabajador</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <div className="flex-1 max-w-sm"><SearchBar value={search} onChange={setSearch} placeholder="Buscar trabajadores..." /></div>
      <Card padding="none">
        <DataTable columns={columns} data={trabajadores} loading={loading} emptyMessage="No hay trabajadores registrados." keyExtractor={(item) => item.id} />
      </Card>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default TrabajadoresPage
