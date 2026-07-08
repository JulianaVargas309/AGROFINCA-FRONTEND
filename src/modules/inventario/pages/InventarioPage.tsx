import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Alert } from "@/components/ui/Alert"
import { SearchBar } from "@/components/shared/SearchBar"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useInventario } from "../hooks/useInventario"
import { useModal } from "@/hooks/useModal"
import { inventarioService } from "../services/inventario.service"
import { useNotification } from "@/hooks/useNotification"
import { CATEGORIA_PRODUCTO_OPTIONS } from "@/constants/inventario"
import type { Producto } from "../types/inventario.types"
import { formatCurrency } from "@/utils/formatCurrency"
import { Plus, Edit, Trash2, AlertTriangle } from "lucide-react"
import { useState } from "react"

const columns: Column<Producto>[] = [
  {
    key: "nombre",
    header: "Nombre",
    render: (item) => (
      <Link to={`/app/inventario/${item.id}`} className="font-medium text-emerald-700 hover:text-emerald-800">
        {item.nombre}
      </Link>
    ),
  },
  { key: "categoria", header: "Categoría" },
  {
    key: "stockActual",
    header: "Stock",
    render: (item) => (
      <div className="flex items-center gap-2">
        <span className={item.stockActual <= item.stockMinimo ? "text-red-600 font-medium" : ""}>
          {item.stockActual}
        </span>
        <span className="text-xs text-stone-400">{item.unidadMedida}</span>
        {item.stockActual <= item.stockMinimo && <AlertTriangle size={14} className="text-red-500" />}
      </div>
    ),
  },
  {
    key: "stockMinimo",
    header: "Mínimo",
    render: (item) => `${item.stockMinimo} ${item.unidadMedida}`,
  },
  {
    key: "precioUnitario",
    header: "Precio",
    render: (item) => (item.precioUnitario ? formatCurrency(item.precioUnitario) : "-"),
  },
  {
    key: "acciones",
    header: "",
    className: "w-[100px]",
    render: (item) => <Actions id={item.id} nombre={item.nombre} />,
  },
]

function Actions({ id, nombre }: { id: number; nombre: string }) {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const confirmModal = useModal()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await inventarioService.remove(id)
      notify({ type: "success", title: "Producto eliminado", message: `"${nombre}" fue desactivado.` })
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
      <button onClick={() => navigate(`/app/inventario/${id}`)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 cursor-pointer">
        <Edit size={16} />
      </button>
      <button onClick={confirmModal.open} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer">
        <Trash2 size={16} />
      </button>
      <ConfirmDialog isOpen={confirmModal.isOpen} onClose={confirmModal.close} onConfirm={handleDelete} title="Eliminar Producto" message={`¿Eliminar "${nombre}"?`} loading={deleting} />
    </div>
  )
}

function InventarioPage() {
  const { productos, loading, error, search, setSearch, categoriaFilter, setCategoriaFilter, stockBajo } = useInventario()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Inventario"
        description="Gestión de productos y existencias"
        actions={
          <Link to="/app/inventario/nuevo">
            <Button><Plus size={16} />Nuevo Producto</Button>
          </Link>
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      {/* Stock bajo alert */}
      {stockBajo.length > 0 && (
        <Alert severity="warning" title={`${stockBajo.length} producto(s) con stock bajo`}>
          <div className="flex flex-wrap gap-2 mt-1">
            {stockBajo.map((p) => (
              <Link key={p.id} to={`/app/inventario/${p.id}`} className="text-xs underline">
                {p.nombre} ({p.stockActual} {p.unidadMedida})
              </Link>
            ))}
          </div>
        </Alert>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1 max-w-sm">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar productos..." />
        </div>
        <select
          value={categoriaFilter}
          onChange={(e) => setCategoriaFilter(e.target.value)}
          className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIA_PRODUCTO_OPTIONS.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      <Card padding="none">
        <DataTable
          columns={columns}
          data={productos}
          loading={loading}
          emptyMessage="No hay productos en inventario."
          keyExtractor={(item) => item.id}
        />
      </Card>
    </div>
  )
}

export default InventarioPage
