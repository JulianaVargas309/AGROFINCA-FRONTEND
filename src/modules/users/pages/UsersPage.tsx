import { Link, useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Alert } from "@/components/ui/Alert"
import { SearchBar } from "@/components/shared/SearchBar"
import { useUsers } from "../hooks/useUsers"
import { UserTable } from "../components/UserTable"
import { UserFilters } from "../components/UserFilters"
import { useNotification } from "@/hooks/useNotification"
import { useModal } from "@/hooks/useModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { usersService } from "../services/users.service"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import type { User } from "../types/user.types"

function UsersPage() {
  const { users, loading, error, search, setSearch, refetch } = useUsers()
  const [rol, setRol] = useState("")
  const [estado, setEstado] = useState("")

  const filtered = users.filter((u) => {
    if (rol && u.rol !== rol) return false
    if (estado === "activo" && !u.activo) return false
    if (estado === "inactivo" && u.activo) return false
    return true
  })

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Usuarios"
        description="Gestiona los usuarios del sistema"
        actions={
          <Link to="/app/usuarios/nuevo">
            <Button><Plus size={16} />Nuevo Usuario</Button>
          </Link>
        }
      />
      {error && <Alert severity="error">{error}</Alert>}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex-1 max-w-sm">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar usuarios..." />
        </div>
        <UserFilters rol={rol} onRolChange={setRol} estado={estado} onEstadoChange={setEstado} />
      </div>
      <Card padding="none">
        <UserTable
          users={filtered}
          loading={loading}
          renderActions={(user) => <Actions user={user} onDelete={refetch} />}
        />
      </Card>
    </div>
  )
}

function Actions({ user, onDelete }: { user: User; onDelete: () => void }) {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const confirmModal = useModal()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await usersService.remove(user.id)
      notify({ type: "success", title: "Usuario eliminado", message: "Usuario desactivado." })
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
        onClick={() => navigate(`/app/usuarios/${user.id}/editar`)}
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
        title="Eliminar Usuario"
        message="¿Estás seguro de desactivar este usuario?"
        confirmLabel="Eliminar"
        loading={deleting}
      />
    </div>
  )
}

export default UsersPage
