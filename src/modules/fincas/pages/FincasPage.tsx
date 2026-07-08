import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Pagination } from "@/components/ui/Pagination"
import { Alert } from "@/components/ui/Alert"
import { SearchBar } from "@/components/shared/SearchBar"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useFincas } from "../hooks/useFincas"
import { useModal } from "@/hooks/useModal"
import { fincaService } from "../services/finca.service"
import { useNotification } from "@/hooks/useNotification"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import type { Finca } from "../types/finca.types"
import { formatDate } from "@/utils/formatDate"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

const columns: Column<Finca>[] = [
  {
    key: "nombre",
    header: "Nombre",
    render: (item) => (
      <Link
        to={`/app/fincas/${item.id}`}
        className="font-medium text-emerald-700 hover:text-emerald-800"
      >
        {item.nombre}
      </Link>
    ),
  },
  { key: "ubicacion", header: "Ubicación" },
  {
    key: "hectareas",
    header: "Hectáreas",
    render: (item) => (item.hectareas ? `${item.hectareas} ha` : "-"),
  },
  {
    key: "createdAt",
    header: "Creada",
    render: (item) => formatDate(item.createdAt),
  },
  {
    key: "acciones",
    header: "",
    className: "w-[100px]",
    render: (item) => (
      <Actions id={item.id} />
    ),
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
      await fincaService.remove(id)
      notify({ type: "success", title: "Finca eliminada", message: "La finca fue desactivada correctamente." })
      confirmModal.close()
      window.location.reload()
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar la finca." })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => navigate(`/app/fincas/${id}`)}
        className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 cursor-pointer"
      >
        <Edit size={16} />
      </button>
      <button
        onClick={confirmModal.open}
        className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
      >
        <Trash2 size={16} />
      </button>
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        onConfirm={handleDelete}
        title="Eliminar Finca"
        message="¿Estás seguro? La finca será desactivada y no aparecerá en los listados."
        confirmLabel="Eliminar"
        loading={deleting}
      />
    </div>
  )
}

function FincasPage() {
  const { fincas, loading, error, pagination, search, setSearch, setPage } = useFincas()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Fincas"
        description="Gestiona todas tus fincas"
        actions={
          <Link to="/app/fincas/nueva">
            <Button>
              <Plus size={16} />
              Nueva Finca
            </Button>
          </Link>
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-sm">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar fincas..."
          />
        </div>
      </div>

      <Card padding="none">
        <DataTable
          columns={columns}
          data={fincas}
          loading={loading}
          emptyMessage="No hay fincas registradas. Crea tu primera finca."
          keyExtractor={(item) => item.id}
        />
      </Card>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}

export default FincasPage
