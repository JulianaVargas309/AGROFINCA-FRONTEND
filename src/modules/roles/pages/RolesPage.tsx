import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useRoles } from "../hooks/useRoles"
import { useNotification } from "@/hooks/useNotification"
import { useModal } from "@/hooks/useModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { rolesService } from "../services/roles.service"
import type { Role } from "../types/role.types"
import { Plus, Edit, Trash2, Shield } from "lucide-react"
import { useState } from "react"

function RolesPage() {
  const { roles, loading, error, refetch } = useRoles()

  const columns: Column<Role>[] = [
    {
      key: "nombre",
      header: "Nombre",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-stone-400" />
          <span className="font-medium text-stone-900">{item.nombre}</span>
        </div>
      ),
    },
    {
      key: "descripcion",
      header: "Descripción",
      render: (item) => item.descripcion || "-",
    },
    {
      key: "nivel",
      header: "Nivel",
    },
    {
      key: "permissions",
      header: "Permisos",
      render: (item) => (
        <span className="text-sm text-stone-600">
          {item.permissions?.length ?? 0} permisos
        </span>
      ),
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
      render: (item) => <Actions role={item} onDelete={refetch} />,
    },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Roles"
        description="Gestiona los roles del sistema"
        actions={
          <Link to="/app/roles/nuevo">
            <Button><Plus size={16} />Nuevo Rol</Button>
          </Link>
        }
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Card padding="none">
        <DataTable
          columns={columns}
          data={roles}
          loading={loading}
          emptyMessage="No hay roles registrados."
          keyExtractor={(item) => item.id}
        />
      </Card>
    </div>
  )
}

function Actions({ role, onDelete }: { role: Role; onDelete: () => void }) {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const confirmModal = useModal()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await rolesService.remove(role.id)
      notify({ type: "success", title: "Rol eliminado", message: "Rol desactivado." })
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
        onClick={() => navigate(`/app/roles/${role.id}/editar`)}
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
        title="Eliminar Rol"
        message="¿Estás seguro de desactivar este rol?"
        confirmLabel="Eliminar"
        loading={deleting}
      />
    </div>
  )
}

export default RolesPage
