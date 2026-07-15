import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { usePermisos } from "../hooks/usePermisos"
import { useNotification } from "@/hooks/useNotification"
import { useModal } from "@/hooks/useModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { permisosService } from "../services/permisos.service"
import type { Permiso } from "../types/permiso.types"
import { Plus, Edit, Trash2, KeyRound } from "lucide-react"
import { useState } from "react"

function PermisosPage() {
  const { permisos, loading, error, refetch } = usePermisos()

  const columns: Column<Permiso>[] = [
    {
      key: "nombre",
      header: "Nombre",
      render: (item) => (
        <div className="flex items-center gap-2">
          <KeyRound size={16} className="text-stone-400" />
          <span className="font-medium text-stone-900">{item.nombre}</span>
        </div>
      ),
    },
    {
      key: "modulo",
      header: "Módulo",
      render: (item) => item.modulo || "-",
    },
    {
      key: "descripcion",
      header: "Descripción",
      render: (item) => item.descripcion || "-",
    },
    {
      key: "activo",
      header: "Estado",
      render: (item) => (
        <Badge color={item.activo ? "success" : "default"}>
          {item.activo ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      key: "acciones",
      header: "",
      className: "w-[100px]",
      render: (item) => <Actions permiso={item} onDelete={refetch} />,
    },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Permisos"
        description="Gestiona los permisos del sistema"
        actions={
          <Link to="/app/permisos/nuevo">
            <Button><Plus size={16} />Nuevo Permiso</Button>
          </Link>
        }
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Card padding="none">
        <DataTable
          columns={columns}
          data={permisos}
          loading={loading}
          emptyMessage="No hay permisos registrados."
          keyExtractor={(item) => item.id}
        />
      </Card>
    </div>
  )
}

function Actions({ permiso, onDelete }: { permiso: Permiso; onDelete: () => void }) {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const confirmModal = useModal()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await permisosService.remove(permiso.id)
      notify({ type: "success", title: "Permiso eliminado", message: "Permiso desactivado." })
      confirmModal.close()
      onDelete()
    } catch {
      notify({ type: "error", title: "Error", message: "No se pudo eliminar." })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => navigate(`/app/permisos/${permiso.id}/editar`)}
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
        title="Eliminar Permiso"
        message="¿Estás seguro de desactivar este permiso?"
        confirmLabel="Eliminar"
        loading={deleting}
      />
    </div>
  )
}

export default PermisosPage
