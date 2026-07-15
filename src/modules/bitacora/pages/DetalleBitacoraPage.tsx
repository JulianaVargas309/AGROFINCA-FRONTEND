import { useParams, useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { BitacoraForm } from "../components/BitacoraForm"
import { useBitacoraEntry } from "../hooks/useBitacoraEntry"
import { useModal } from "@/hooks/useModal"
import { useNotification } from "@/hooks/useNotification"
import { ROUTES } from "@/constants/routes"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import { BackButton } from "@/components/shared/BackButton"
import { MapPin, Sprout, Package, DollarSign, Edit, Trash2, ArrowLeft } from "lucide-react"
import { useState } from "react"
import type { UpdateBitacoraFormData } from "../schemas/bitacora.schema"

function DetalleBitacoraPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const entryId = id ? Number(id) : null
  const { entry, loading, error, saving, deleting, updateEntry, deleteEntry } = useBitacoraEntry(entryId)
  const { notify } = useNotification()
  const editModal = useModal()
  const deleteModal = useModal()
  const [editError, setEditError] = useState<string | null>(null)

  const handleUpdate = async (data: UpdateBitacoraFormData) => {
    if (!entryId) return
    setEditError(null)
    try {
      await updateEntry(entryId, data)
      notify({ type: "success", title: "Registro actualizado" })
      editModal.close()
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Error")
    }
  }

  const handleDelete = async () => {
    if (!entryId) return
    try {
      await deleteEntry(entryId)
      notify({ type: "success", title: "Registro eliminado" })
      navigate(ROUTES.BITACORA)
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar." })
    }
  }

  if (loading) return <div className="space-y-6"><Breadcrumb /><div className="flex justify-center py-20"><Spinner size="lg" /></div></div>
  if (!entry) return <div className="space-y-6"><Breadcrumb /><Alert severity="error">Registro no encontrado.</Alert><Link to={ROUTES.BITACORA}><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link></div>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title={entry.actividad}
        description={formatDate(entry.fecha)}
        actions={
          <div className="flex gap-2">
            <BackButton to="/app/bitacora" />
            <Button variant="outline" onClick={editModal.open}><Edit size={16} />Editar</Button>
            <Button variant="danger" onClick={deleteModal.open}><Trash2 size={16} />Eliminar</Button>
          </div>
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {entry.lote && (
          <Card>
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-1"><MapPin size={16} /><span className="text-xs font-medium">Lote</span></div>
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{entry.lote.nombre}</p>
          </Card>
        )}
        {entry.cultivo && (
          <Card>
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-1"><Sprout size={16} /><span className="text-xs font-medium">Cultivo</span></div>
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{entry.cultivo.nombre}</p>
          </Card>
        )}
        {entry.producto && (
          <Card>
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-1"><Package size={16} /><span className="text-xs font-medium">Producto</span></div>
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{entry.producto.nombre}</p>
          </Card>
        )}
        <Card>
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-1"><DollarSign size={16} /><span className="text-xs font-medium">Costo</span></div>
          <p className="text-lg font-bold text-stone-900 dark:text-stone-100">{formatCurrency(entry.costo || 0)}</p>
        </Card>
      </div>

      {entry.cantidad && (
        <Card>
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-1"><Package size={16} /><span className="text-xs font-medium">Cantidad usada</span></div>
          <p className="text-sm text-stone-900 dark:text-stone-100">{entry.cantidad} {entry.unidadMedida || "unidades"}</p>
        </Card>
      )}

      <Card>
        <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">Descripción</h3>
        <p className="text-sm text-stone-600 dark:text-stone-300 whitespace-pre-wrap">{entry.descripcion}</p>
      </Card>

      {entry.observaciones && (
        <Card>
          <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">Observaciones</h3>
          <p className="text-sm text-stone-600 dark:text-stone-300 whitespace-pre-wrap">{entry.observaciones}</p>
        </Card>
      )}

      {entry.user && (
        <p className="text-xs text-stone-400 dark:text-stone-500 text-right">Registrado por: {entry.user.nombre} · {formatDate(entry.fecha)}</p>
      )}

      {editModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={editModal.close} />
          <div className="relative z-10 mx-4 w-full max-w-lg rounded-xl bg-white dark:bg-stone-900 p-6 shadow-xl max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">Editar Registro</h2>
            <BitacoraForm mode="edit" defaultValues={entry as unknown as Record<string, unknown>} onSubmit={handleUpdate} loading={saving} error={editError} onClearError={() => setEditError(null)} submitLabel="Guardar Cambios" />
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={deleteModal.isOpen} onClose={deleteModal.close} onConfirm={handleDelete} title="Eliminar Registro" message="¿Eliminar este registro de la bitácora?" loading={deleting} />
    </div>
  )
}

export default DetalleBitacoraPage
