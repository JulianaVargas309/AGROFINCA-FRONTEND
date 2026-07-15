import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { Spinner } from "@/components/ui/Spinner"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { GastoForm } from "../components/GastoForm"
import { useFinanza } from "../hooks/useFinanza"
import { useModal } from "@/hooks/useModal"
import { useNotification } from "@/hooks/useNotification"
import { ROUTES } from "@/constants/routes"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import { CATEGORIA_GASTO_OPTIONS, type CreateGastoFormData } from "../schemas/finanza.schema"
import type { UpdateGastoFormData } from "../schemas/finanza.schema"
import type { Gasto } from "../types/finanza.types"
import { BackButton } from "@/components/shared/BackButton"
import { DollarSign, MapPin, Sprout, ShoppingCart, Edit, Trash2, ArrowLeft, User } from "lucide-react"
import { useState } from "react"

function DetalleFinanzaPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const tipo = (searchParams.get("tipo") as "gasto" | "venta") || "gasto"
  const navigate = useNavigate()
  const finanzaId = id ? Number(id) : null
  const { gasto, venta, loading, error, saving, deleting, updateGasto, deleteGasto, updateVentaEstado } = useFinanza(finanzaId, tipo)
  const { notify } = useNotification()
  const editModal = useModal()
  const deleteModal = useModal()
  const [editError, setEditError] = useState<string | null>(null)

  const handleUpdateGasto = async (data: UpdateGastoFormData) => {
    if (!finanzaId) return
    setEditError(null)
    try {
      await updateGasto(finanzaId, data as unknown as Partial<Gasto>)
      notify({ type: "success", title: "Gasto actualizado" })
      editModal.close()
    } catch (err) { setEditError(err instanceof Error ? err.message : "Error") }
  }

  const handleDelete = async () => {
    if (!finanzaId) return
    try {
      if (tipo === "gasto") {
        await deleteGasto(finanzaId)
      } else {
        await updateVentaEstado(finanzaId, "ANULADA")
      }
      notify({ type: "success", title: tipo === "gasto" ? "Gasto eliminado" : "Venta anulada" })
      navigate(ROUTES.FINANZAS)
    } catch { notify({ type: "error", title: "Error" }) }
  }

  if (loading) return <div className="space-y-6"><Breadcrumb /><div className="flex justify-center py-20"><Spinner size="lg" /></div></div>
  if (!gasto && !venta) return <div className="space-y-6"><Breadcrumb /><Alert severity="error">Registro no encontrado.</Alert><Link to={ROUTES.FINANZAS}><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link></div>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      {gasto && (
        <>
          <PageHeader title={gasto.descripcion} description={formatDate(gasto.fecha)} actions={
            <div className="flex gap-2">
              <BackButton to="/app/finanzas" />
              <Button variant="outline" onClick={editModal.open}><Edit size={16} />Editar</Button>
              <Button variant="danger" onClick={deleteModal.open}><Trash2 size={16} />Eliminar</Button>
            </div>
          } />
          {error && <Alert severity="error">{error}</Alert>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card><div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-1"><DollarSign size={16} /><span className="text-xs font-medium">Monto</span></div><p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(gasto.monto)}</p></Card>
            {gasto.categoria && <Card><div className="text-xs text-stone-500 dark:text-stone-400 mb-1">Categoría</div><Badge>{CATEGORIA_GASTO_OPTIONS.find((c) => c.value === gasto.categoria)?.label || gasto.categoria}</Badge></Card>}
            {gasto.lote && <Card><div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-1"><MapPin size={16} /><span className="text-xs font-medium">Lote</span></div><p className="text-sm font-semibold">{gasto.lote.nombre}</p></Card>}
            {gasto.cultivo && <Card><div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-1"><Sprout size={16} /><span className="text-xs font-medium">Cultivo</span></div><p className="text-sm font-semibold">{gasto.cultivo.nombre}</p></Card>}
          </div>
        </>
      )}

      {venta && (
        <>
          <PageHeader title={`Venta #${venta.id}`} description={formatDate(venta.fecha)} actions={
            <div className="flex gap-2">
              <BackButton to="/app/finanzas" />
              {venta.estado !== "ANULADA" && (
                <>
                  {venta.estado === "PENDIENTE" && <Button variant="outline" onClick={() => updateVentaEstado(venta.id, "COMPLETADA")} loading={saving}>Completar</Button>}
                  <Button variant="danger" onClick={deleteModal.open}>Anular</Button>
                </>
              )}
            </div>
          } />
          {error && <Alert severity="error">{error}</Alert>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card><div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-1"><DollarSign size={16} /><span className="text-xs font-medium">Total</span></div><p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(venta.total)}</p></Card>
            <Card><div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-1"><ShoppingCart size={16} /><span className="text-xs font-medium">Estado</span></div><Badge color={venta.estado === "COMPLETADA" ? "success" : venta.estado === "PENDIENTE" ? "warning" : "error"}>{venta.estado}</Badge></Card>
            {venta.cliente && <Card><div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-1"><User size={16} /><span className="text-xs font-medium">Cliente</span></div><p className="text-sm font-semibold">{venta.cliente.nombre}</p></Card>}
          </div>
          {venta.detalles && venta.detalles.length > 0 && (
            <Card>
              <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200 mb-3">Detalles</h3>
              <div className="divide-y divide-stone-100 dark:divide-stone-800 -mx-5">
                {venta.detalles.map((d, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <div><p className="text-sm text-stone-700 dark:text-stone-200">{d.producto?.nombre || `Producto #${d.productoId}`}</p><p className="text-xs text-stone-500 dark:text-stone-400">{d.cantidad} x {formatCurrency(d.precioUnitario)}</p></div>
                    <p className="text-sm font-bold text-stone-700 dark:text-stone-200">{formatCurrency(d.subtotal)}</p>
                  </div>
                ))}
                <div className="flex items-center justify-between px-5 py-3 bg-stone-50 dark:bg-stone-800">
                  <p className="text-sm font-semibold">Total</p>
                  <p className="text-sm font-bold">{formatCurrency(venta.total)}</p>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {editModal.isOpen && gasto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={editModal.close} />
          <div className="relative z-10 mx-4 w-full max-w-lg rounded-xl bg-white dark:bg-stone-900 p-6 shadow-xl max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">Editar Gasto</h2>
            <GastoForm mode="edit" defaultValues={gasto as unknown as Partial<CreateGastoFormData>} onSubmit={handleUpdateGasto} loading={saving} error={editError} onClearError={() => setEditError(null)} submitLabel="Guardar Cambios" />
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={deleteModal.isOpen} onClose={deleteModal.close} onConfirm={handleDelete} title={tipo === "gasto" ? "Eliminar Gasto" : "Anular Venta"} message="¿Confirmas esta acción?" loading={deleting} />
    </div>
  )
}

export default DetalleFinanzaPage
