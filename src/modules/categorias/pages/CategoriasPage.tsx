import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Pagination } from "@/components/ui/Pagination"
import { Alert } from "@/components/ui/Alert"
import { SearchBar } from "@/components/shared/SearchBar"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useCategorias } from "../hooks/useCategorias"
import { useModal } from "@/hooks/useModal"
import { categoriaService } from "../services/categoria.service"
import { useNotification } from "@/hooks/useNotification"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import type { CategoriaProducto } from "../types/categoria.types"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/Badge"

const columns: Column<CategoriaProducto>[] = [
  {
    key: "nombre",
    header: "Nombre",
    render: (item) => (
      <Link to={`/app/categorias/${item.id}`} className="font-medium text-emerald-700 hover:text-emerald-800">
        {item.nombre}
      </Link>
    ),
  },
  { key: "descripcion", header: "Descripción", render: (item) => item.descripcion || "-" },
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
      await categoriaService.remove(id)
      notify({ type: "success", title: "Categoría eliminada", message: "Categoría eliminada correctamente." })
      confirmModal.close()
      window.location.reload()
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar la categoría." })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => navigate(`/app/categorias/${id}`)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 cursor-pointer">
        <Edit size={16} />
      </button>
      <button onClick={confirmModal.open} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer">
        <Trash2 size={16} />
      </button>
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        onConfirm={handleDelete}
        title="Eliminar Categoría"
        message="¿Estás seguro de eliminar esta categoría?"
        confirmLabel="Eliminar"
        loading={deleting}
      />
    </div>
  )
}

function CategoriasPage() {
  const { categorias, loading, error, pagination, search, setSearch, setPage } = useCategorias()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Categorías"
        description="Gestiona las categorías de productos"
        actions={
          <Link to="/app/categorias/nueva">
            <Button>
              <Plus size={16} />
              Nueva Categoría
            </Button>
          </Link>
        }
      />
      {error && <Alert severity="error">{error}</Alert>}
      <div className="flex-1 max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar categorías..." />
      </div>
      <Card padding="none">
        <DataTable columns={columns} data={categorias} loading={loading} emptyMessage="No hay categorías registradas." keyExtractor={(item) => item.id} />
      </Card>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}

export default CategoriasPage
