import { useParams, useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { Spinner } from "@/components/ui/Spinner"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { FincaForm } from "../components/FincaForm"
import { useFinca } from "../hooks/useFinca"
import { useModal } from "@/hooks/useModal"
import { useNotification } from "@/hooks/useNotification"
import { ROUTES } from "@/constants/routes"
import { formatDate } from "@/utils/formatDate"
import type { UpdateFincaFormData } from "../schemas/finca.schema"
import { MapPin, Ruler, Calendar, Edit, Trash2, ArrowLeft } from "lucide-react"
import { useState } from "react"

function DetalleFincaPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const fincaId = id ? Number(id) : null
  const { finca, loading, error, saving, deleting, updateFinca, deleteFinca } = useFinca(fincaId)
  const { notify } = useNotification()
  const editModal = useModal()
  const deleteModal = useModal()
  const [editError, setEditError] = useState<string | null>(null)

  const handleUpdate = async (data: UpdateFincaFormData) => {
    if (!fincaId) return
    setEditError(null)
    try {
      await updateFinca(fincaId, data)
      notify({ type: "success", title: "Finca actualizada", message: "Los datos fueron guardados." })
      editModal.close()
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Error al actualizar")
    }
  }

  const handleDelete = async () => {
    if (!fincaId) return
    try {
      await deleteFinca(fincaId)
      notify({ type: "success", title: "Finca eliminada", message: "La finca fue desactivada." })
      navigate(ROUTES.FINCAS)
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar la finca." })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </div>
    )
  }

  if (!finca) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <Alert severity="error">Finca no encontrada.</Alert>
        <Link to={ROUTES.FINCAS}>
          <Button variant="outline">
            <ArrowLeft size={16} />
            Volver a fincas
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title={finca.nombre}
        description={`Finca registrada el ${formatDate(finca.createdAt)}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={editModal.open}>
              <Edit size={16} />
              Editar
            </Button>
            <Button variant="danger" onClick={deleteModal.open}>
              <Trash2 size={16} />
              Eliminar
            </Button>
          </div>
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {finca.ubicacion && (
          <Card>
            <div className="flex items-center gap-2 text-stone-500 mb-1">
              <MapPin size={16} />
              <span className="text-xs font-medium">Ubicación</span>
            </div>
            <p className="text-sm text-stone-900">{finca.ubicacion}</p>
          </Card>
        )}
        {finca.hectareas && (
          <Card>
            <div className="flex items-center gap-2 text-stone-500 mb-1">
              <Ruler size={16} />
              <span className="text-xs font-medium">Hectáreas</span>
            </div>
            <p className="text-lg font-bold text-stone-900">{finca.hectareas} ha</p>
          </Card>
        )}
        <Card>
          <div className="flex items-center gap-2 text-stone-500 mb-1">
            <Calendar size={16} />
            <span className="text-xs font-medium">Estado</span>
          </div>
          <Badge color={finca.activo ? "success" : "error"}>
            {finca.activo ? "Activa" : "Inactiva"}
          </Badge>
        </Card>
      </div>

      {finca.descripcion && (
        <Card>
          <h3 className="text-sm font-semibold text-stone-700 mb-2">Descripción</h3>
          <p className="text-sm text-stone-600 whitespace-pre-wrap">{finca.descripcion}</p>
        </Card>
      )}

      {/* Edit Modal */}
      <div>
        {editModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={editModal.close} />
            <div className="relative z-10 mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-auto">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">Editar Finca</h2>
              <FincaForm
                mode="edit"
                defaultValues={finca}
                onSubmit={handleUpdate}
                loading={saving}
                error={editError}
                onClearError={() => setEditError(null)}
                submitLabel="Guardar Cambios"
              />
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleDelete}
        title="Eliminar Finca"
        message={`¿Estás seguro de eliminar "${finca.nombre}"? Será desactivada.`}
        loading={deleting}
      />
    </div>
  )
}

export default DetalleFincaPage
