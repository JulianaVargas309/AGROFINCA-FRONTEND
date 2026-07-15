import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Pagination } from "@/components/ui/Pagination"
import { Alert } from "@/components/ui/Alert"
import { SearchBar } from "@/components/shared/SearchBar"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useTemporadas } from "../hooks/useTemporadas"
import { useModal } from "@/hooks/useModal"
import { temporadaService } from "../services/temporada.service"
import { useNotification } from "@/hooks/useNotification"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import type { Temporada } from "../types/temporada.types"
import { formatDate } from "@/utils/formatDate"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/Badge"

const columns: Column<Temporada>[] = [
  {
    key: "nombre",
    header: "Nombre",
    render: (item) => (
      <Link to={`/app/temporadas/${item.id}`} className="font-medium text-emerald-700 hover:text-emerald-800">
        {item.nombre}
      </Link>
    ),
  },
  { key: "descripcion", header: "Descripción", render: (item) => item.descripcion || "-" },
  {
    key: "fechaInicio",
    header: "Inicio",
    render: (item) => formatDate(item.fechaInicio),
  },
  {
    key: "fechaFin",
    header: "Fin",
    render: (item) => (item.fechaFin ? formatDate(item.fechaFin) : "-"),
  },
  {
    key: "activo",
    header: "Estado",
    render: (item) => <Badge color={item.activo ? "success" : "default"}>{item.activo ? "Activo" : "Inactivo"}</Badge>,
  },
  { key: "finca", header: "Finca", render: (item) => item.finca?.nombre || "-" },
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
      await temporadaService.remove(id)
      notify({ type: "success", title: "Temporada eliminada", message: "Temporada eliminada correctamente." })
      confirmModal.close()
      window.location.reload()
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar la temporada." })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => navigate(`/app/temporadas/${id}`)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 cursor-pointer">
        <Edit size={16} />
      </button>
      <button onClick={confirmModal.open} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer">
        <Trash2 size={16} />
      </button>
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        onConfirm={handleDelete}
        title="Eliminar Temporada"
        message="¿Estás seguro de eliminar esta temporada?"
        confirmLabel="Eliminar"
        loading={deleting}
      />
    </div>
  )
}

function TemporadasPage() {
  const { temporadas, loading, error, pagination, search, setSearch, setPage } = useTemporadas()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Temporadas"
        description="Gestiona las temporadas de producción"
        actions={
          <Link to="/app/temporadas/nueva">
            <Button>
              <Plus size={16} />
              Nueva Temporada
            </Button>
          </Link>
        }
      />
      {error && <Alert severity="error">{error}</Alert>}
      <div className="flex-1 max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar temporadas..." />
      </div>
      <Card padding="none">
        <DataTable columns={columns} data={temporadas} loading={loading} emptyMessage="No hay temporadas registradas." keyExtractor={(item) => item.id} />
      </Card>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default TemporadasPage
