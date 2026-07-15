import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Alert } from "@/components/ui/Alert"
import { Modal } from "@/components/ui/Modal"
import { PerfilForm } from "../components/PerfilForm"
import { useAuth } from "@/hooks/useAuth"
import { ROLES } from "@/constants/roles"
import { formatDate } from "@/utils/formatDate"
import { usePerfil } from "../hooks/usePerfil"
import type { PerfilData } from "../types/perfil.types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { changePasswordSchema, type ChangePasswordInput } from "../schemas/perfil.schema"
import { User, Shield, Calendar, IdCard, Mail, Phone, Lock, Edit3, Camera } from "lucide-react"
import { useState } from "react"

function PerfilPage() {
  const { user } = useAuth()
  const { saving, error, successMessage, changePassword, clearMessages } = usePerfil()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  })

  const handleChangePassword = async (data: ChangePasswordInput) => {
    await changePassword(data)
    reset()
    setShowPasswordModal(false)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Perfil"
        description="Gestión de tu cuenta"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
              <Edit3 size={14} />Editar Perfil
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowPasswordModal(true)}>
              <Lock size={14} />Cambiar Contraseña
            </Button>
          </div>
        }
      />

      {error && <Alert severity="error" onClose={clearMessages}>{error}</Alert>}
      {successMessage && <Alert severity="success" onClose={clearMessages}>{successMessage}</Alert>}

      {user && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <div className="flex items-center gap-2 text-stone-500 mb-1"><User size={16} /><span className="text-xs font-medium">Usuario</span></div>
              <p className="text-sm font-semibold text-stone-900">{user.nombre ?? user.documento}</p>
            </Card>
            <Card>
              <div className="flex items-center gap-2 text-stone-500 mb-1"><IdCard size={16} /><span className="text-xs font-medium">Documento</span></div>
              <p className="text-sm font-semibold text-stone-900 truncate">{user.documento}</p>
            </Card>
            <Card>
              <div className="flex items-center gap-2 text-stone-500 mb-1"><Shield size={16} /><span className="text-xs font-medium">Rol</span></div>
              <Badge color={user.rol === "ADMIN" ? "error" : user.rol === "FAMILIAR" ? "info" : "default"}>{ROLES[user.rol] || user.rol}</Badge>
            </Card>
            <Card>
              <div className="flex items-center gap-2 text-stone-500 mb-1"><Calendar size={16} /><span className="text-xs font-medium">Miembro desde</span></div>
              <p className="text-sm text-stone-700">{user.createdAt ? formatDate(user.createdAt) : "-"}</p>
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <div className="flex items-center gap-2 text-stone-500 mb-1"><Mail size={16} /><span className="text-xs font-medium">Correo</span></div>
              <p className="text-sm text-stone-700">{(user as unknown as PerfilData).correo || "-"}</p>
            </Card>
            <Card>
              <div className="flex items-center gap-2 text-stone-500 mb-1"><Phone size={16} /><span className="text-xs font-medium">Teléfono</span></div>
              <p className="text-sm text-stone-700">{(user as unknown as PerfilData).telefono || "-"}</p>
            </Card>
            <Card>
              <div className="flex items-center gap-2 text-stone-500 mb-1"><Calendar size={16} /><span className="text-xs font-medium">Último Acceso</span></div>
              <p className="text-sm text-stone-700">{(user as unknown as PerfilData).ultimoAcceso ? formatDate((user as unknown as PerfilData).ultimoAcceso!) : "-"}</p>
            </Card>
            <Card>
              <div className="flex items-center gap-2 text-stone-500 mb-1"><Camera size={16} /><span className="text-xs font-medium">Foto</span></div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold text-sm">
                  {user.nombre ? user.nombre.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="text-xs text-stone-400">Sin foto</span>
              </div>
            </Card>
          </div>
        </>
      )}

      <PerfilForm />

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Perfil" size="lg">
        <PerfilForm />
      </Modal>

      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Cambiar Contraseña">
        <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-4">
          <Input
            label="Nueva contraseña"
            type="password"
            placeholder="Mínimo 6 caracteres"
            icon={<Lock size={18} />}
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="Repite la nueva contraseña"
            icon={<Lock size={18} />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowPasswordModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Cambiar Contraseña</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default PerfilPage
