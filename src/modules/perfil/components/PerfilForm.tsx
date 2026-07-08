import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Card } from "@/components/ui/Card"
import { perfilSchema, changePasswordSchema, type PerfilInput, type ChangePasswordInput } from "../schemas/perfil.schema"
import { usePerfil } from "../hooks/usePerfil"
import { useAuth } from "@/hooks/useAuth"
import { User, Lock, IdCard } from "lucide-react"

function PerfilForm() {
  const { user } = useAuth()
  const { saving, error, successMessage, updateProfile, changePassword, clearMessages } = usePerfil()

  const {
    register: registerInfo,
    handleSubmit: handleInfoSubmit,
    formState: { errors: infoErrors },
  } = useForm<PerfilInput>({
    resolver: zodResolver(perfilSchema),
    defaultValues: { nombre: user?.nombre ?? "", documento: user?.documento ?? "" },
  })

  const {
    register: registerPwd,
    handleSubmit: handlePwdSubmit,
    formState: { errors: pwdErrors },
    reset: resetPwd,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  })

  return (
    <div className="space-y-6">
      {error && <Alert severity="error" onClose={clearMessages}>{error}</Alert>}
      {successMessage && <Alert severity="success" onClose={clearMessages}>{successMessage}</Alert>}

      <Card>
        <h3 className="text-sm font-semibold text-stone-700 mb-4">Información Personal</h3>
        <form onSubmit={handleInfoSubmit(updateProfile)} className="space-y-4">
          <Input label="Usuario" icon={<User size={18} />} error={infoErrors.nombre?.message} {...registerInfo("nombre")} />
          <Input label="Número de documento" icon={<IdCard size={18} />} error={infoErrors.documento?.message} {...registerInfo("documento")} />
          <div className="flex justify-end">
            <Button type="submit" loading={saving}>Guardar Cambios</Button>
          </div>
        </form>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-stone-700 mb-4">Cambiar Contraseña</h3>
        <form
          onSubmit={handlePwdSubmit(async (data) => {
            await changePassword(data)
            resetPwd()
          })}
          className="space-y-4"
        >
          <Input label="Nueva contraseña" type="password" placeholder="Mínimo 6 caracteres" icon={<Lock size={18} />} error={pwdErrors.newPassword?.message} {...registerPwd("newPassword")} />
          <Input label="Confirmar contraseña" type="password" placeholder="Repite la nueva contraseña" icon={<Lock size={18} />} error={pwdErrors.confirmPassword?.message} {...registerPwd("confirmPassword")} />
          <div className="flex justify-end">
            <Button type="submit" variant="secondary" loading={saving}>Cambiar Contraseña</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export { PerfilForm }
