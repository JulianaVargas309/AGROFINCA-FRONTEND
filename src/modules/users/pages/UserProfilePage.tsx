import { useParams, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { Modal } from "@/components/ui/Modal"
import { useUser } from "../hooks/useUser"
import { UserCard } from "../components/UserCard"
import { usersService } from "../services/users.service"
import { useNotification } from "@/hooks/useNotification"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { changePasswordSchema, changeRolSchema, type ChangePasswordFormData, type ChangeRolFormData } from "../schemas/user.schema"
import { ArrowLeft, Edit, Lock, Shield } from "lucide-react"
import { useState } from "react"
import type { Option } from "@/types"

const rolOptions: Option[] = [
  { value: "ADMIN", label: "Admin" },
  { value: "FAMILIAR", label: "Familiar" },
  { value: "TRABAJADOR", label: "Trabajador" },
  { value: "CONSULTA", label: "Consulta" },
]

function UserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { notify } = useNotification()
  const { user, loading, error, refetch } = useUser(id ? Number(id) : null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showRolModal, setShowRolModal] = useState(false)
  const [saving, setSaving] = useState(false)

  const passwordForm = useForm<ChangePasswordFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(changePasswordSchema) as any,
  })

  const rolForm = useForm<ChangeRolFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(changeRolSchema) as any,
  })

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    if (!user) return
    setSaving(true)
    try {
      await usersService.changePassword(user.id, data.currentPassword, data.newPassword)
      notify({ type: "success", title: "Contraseña cambiada", message: "Contraseña actualizada correctamente." })
      setShowPasswordModal(false)
      passwordForm.reset()
    } catch (err) {
      notify({ type: "error", title: "Error", message: err instanceof Error ? err.message : "No se pudo cambiar la contraseña." })
    } finally {
      setSaving(false)
    }
  }

  const handleChangeRol = async (data: ChangeRolFormData) => {
    if (!user) return
    setSaving(true)
    try {
      await usersService.changeRol(user.id, data.rol, data.roleId)
      notify({ type: "success", title: "Rol cambiado", message: "Rol actualizado correctamente." })
      setShowRolModal(false)
      refetch()
    } catch (err) {
      notify({ type: "error", title: "Error", message: err instanceof Error ? err.message : "No se pudo cambiar el rol." })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!user) return <Alert severity="info">Usuario no encontrado</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title={`${user.nombre} ${user.apellido || ""}`}
        description={`${user.documento} · ${user.rol}`}
        actions={
          <div className="flex gap-2">
            <Link to={`/app/usuarios/${user.id}/editar`}>
              <Button variant="outline" size="sm"><Edit size={14} />Editar</Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => setShowPasswordModal(true)}>
              <Lock size={14} />Cambiar Contraseña
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowRolModal(true)}>
              <Shield size={14} />Cambiar Rol
            </Button>
            <Link to="/app/usuarios">
              <Button variant="outline" size="sm"><ArrowLeft size={14} />Volver</Button>
            </Link>
          </div>
        }
      />

      <UserCard user={user} />

      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Cambiar Contraseña">
        <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4">
          <Input
            label="Contraseña actual"
            type="password"
            icon={<Lock size={18} />}
            error={passwordForm.formState.errors.currentPassword?.message}
            {...passwordForm.register("currentPassword")}
          />
          <Input
            label="Nueva contraseña"
            type="password"
            icon={<Lock size={18} />}
            error={passwordForm.formState.errors.newPassword?.message}
            {...passwordForm.register("newPassword")}
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            icon={<Lock size={18} />}
            error={passwordForm.formState.errors.confirmPassword?.message}
            {...passwordForm.register("confirmPassword")}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowPasswordModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Guardar</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showRolModal} onClose={() => setShowRolModal(false)} title="Cambiar Rol">
        <form onSubmit={rolForm.handleSubmit(handleChangeRol)} className="space-y-4">
          <Select
            label="Nuevo rol"
            options={rolOptions}
            placeholder="Seleccione..."
            error={rolForm.formState.errors.rol?.message}
            {...rolForm.register("rol")}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowRolModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default UserProfilePage
