import { useParams, useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { Spinner } from "@/components/ui/Spinner"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { InventarioForm } from "../components/InventarioForm"
import { MovimientoForm } from "../components/MovimientoForm"
import { useProducto } from "../hooks/useProducto"
import { useModal } from "@/hooks/useModal"
import { useNotification } from "@/hooks/useNotification"
import { ROUTES } from "@/constants/routes"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import { TIPO_MOVIMIENTO_LABELS } from "@/constants/inventario"
import type { UpdateProductoFormData } from "../schemas/inventario.schema"
import type { CreateMovimientoFormData } from "../schemas/inventario.schema"
import { ArrowLeft, Package, AlertTriangle, ArrowDown, ArrowUp, Edit, Trash2, DollarSign } from "lucide-react"
import { useState } from "react"

function DetalleInventariopage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const productoId = id ? Number(id) : null
  const { producto, movimientos, loading, error, saving, deleting, updateProducto, deleteProducto, addMovimiento } = useProducto(productoId)
  const { notify } = useNotification()
  const editModal = useModal()
  const deleteModal = useModal()
  const [editError, setEditError] = useState<string | null>(null)
  const [movError, setMovError] = useState<string | null>(null)

  const handleUpdate = async (data: UpdateProductoFormData) => {
    if (!productoId) return
    setEditError(null)
    try {
      await updateProducto(productoId, data)
      notify({ type: "success", title: "Producto actualizado" })
      editModal.close()
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Error al actualizar")
    }
  }

  const handleDelete = async () => {
    if (!productoId) return
    try {
      await deleteProducto(productoId)
      notify({ type: "success", title: "Producto eliminado" })
      navigate(ROUTES.INVENTARIO)
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar." })
    }
  }

  const handleMovimiento = async (data: CreateMovimientoFormData) => {
    setMovError(null)
    try {
      await addMovimiento(data)
      notify({ type: "success", title: "Movimiento registrado" })
    } catch (err) {
      setMovError(err instanceof Error ? err.message : "Error al registrar movimiento")
    }
  }

  if (loading) {
    return <div className="space-y-6"><Breadcrumb /><div className="flex justify-center py-20"><Spinner size="lg" /></div></div>
  }

  if (!producto) {
    return <div className="space-y-6"><Breadcrumb /><Alert severity="error">Producto no encontrado.</Alert><Link to={ROUTES.INVENTARIO}><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link></div>
  }

  const stockBajo = producto.stockActual <= producto.stockMinimo

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title={producto.nombre}
        description={producto.descripcion ?? `Categoría: ${producto.categoria || "Sin categoría"}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={editModal.open}><Edit size={16} />Editar</Button>
            <Button variant="danger" onClick={deleteModal.open}><Trash2 size={16} />Eliminar</Button>
          </div>
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-2 text-stone-500 mb-1"><Package size={16} /><span className="text-xs font-medium">Stock Actual</span></div>
          <div className="flex items-center gap-2">
            <p className={`text-lg font-bold ${stockBajo ? "text-red-600" : "text-stone-900"}`}>{producto.stockActual}</p>
            <span className="text-xs text-stone-400">{producto.unidadMedida}</span>
            {stockBajo && <AlertTriangle size={18} className="text-red-500" />}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-stone-500 mb-1"><AlertTriangle size={16} /><span className="text-xs font-medium">Stock Mínimo</span></div>
          <p className="text-lg font-bold text-stone-900">{producto.stockMinimo} {producto.unidadMedida}</p>
        </Card>
        {producto.precioUnitario && (
          <Card>
            <div className="flex items-center gap-2 text-stone-500 mb-1"><DollarSign size={16} /><span className="text-xs font-medium">Precio Unitario</span></div>
            <p className="text-lg font-bold text-stone-900">{formatCurrency(producto.precioUnitario)}</p>
          </Card>
        )}
        <Card>
          <div className="flex items-center gap-2 text-stone-500 mb-1"><Badge color={producto.activo ? "success" : "error"}>{producto.activo ? "Activo" : "Inactivo"}</Badge></div>
          <p className="text-lg font-bold text-stone-900">{producto.categoria || "Sin categoría"}</p>
        </Card>
      </div>

      {stockBajo && (
        <Alert severity="warning" title="Stock bajo">
          El stock actual ({producto.stockActual}) está por debajo del mínimo ({producto.stockMinimo}).
        </Alert>
      )}

      {/* Registrar Movimiento */}
      <Card>
        <h3 className="text-sm font-semibold text-stone-700 mb-3">Registrar Movimiento</h3>
        {movError && <div className="mb-3"><Alert severity="error">{movError}</Alert></div>}
        <MovimientoForm productoId={producto.id} onSubmit={handleMovimiento} loading={saving} />
      </Card>

      {/* Historial de Movimientos */}
      <Card>
        <h3 className="text-sm font-semibold text-stone-700 mb-4">Historial de Movimientos</h3>
        {movimientos.length === 0 ? (
          <div className="py-6 text-center">
            <Package size={28} className="mx-auto text-stone-300" />
            <p className="mt-2 text-sm text-stone-500">Sin movimientos registrados.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 -mx-5">
            {movimientos.map((m) => (
              <div key={m.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${m.tipo === "entrada" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                    {m.tipo === "entrada" ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-stone-700">{TIPO_MOVIMIENTO_LABELS[m.tipo.toUpperCase() as keyof typeof TIPO_MOVIMIENTO_LABELS] || m.tipo}</p>
                    {m.motivo && <p className="text-xs text-stone-500">{m.motivo}</p>}
                    <p className="text-xs text-stone-400">{formatDate(m.fecha)} · {m.user?.nombre}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${m.tipo === "entrada" ? "text-emerald-600" : "text-red-600"}`}>
                  {m.tipo === "entrada" ? "+" : "-"}{m.cantidad}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={editModal.close} />
          <div className="relative z-10 mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Editar Producto</h2>
            <InventarioForm mode="edit" defaultValues={producto} onSubmit={handleUpdate} loading={saving} error={editError} onClearError={() => setEditError(null)} submitLabel="Guardar Cambios" />
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={deleteModal.isOpen} onClose={deleteModal.close} onConfirm={handleDelete} title="Eliminar Producto" message={`¿Eliminar "${producto.nombre}"?`} loading={deleting} />
    </div>
  )
}

export default DetalleInventariopage
