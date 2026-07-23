import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormInput, FormActions } from "@/components/form"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Card } from "@/components/ui/Card"
import { perfilSchema, changePasswordSchema, type PerfilInput, type ChangePasswordInput } from "../schemas/perfil.schema"
import { usePerfil } from "../hooks/usePerfil"
import { useAuth } from "@/hooks/useAuth"
import { User, Lock, IdCard, Mail, Phone } from "lucide-react"

function PerfilForm() {
  const { user } = useAuth()
  const { profile, saving, error, successMessage, updateProfile, changePassword, clearMessages } = usePerfil()

  const {
    register: registerInfo,
    handleSubmit: handleInfoSubmit,
    formState: { errors: infoErrors },
    reset: resetInfo,
  } = useForm<PerfilInput>({
    resolver: zodResolver(perfilSchema),
    defaultValues: { nombre: "", documento: "", correo: "", telefono: "" },
  })

  useEffect(() => {
    if (profile) {
      resetInfo({
        nombre: profile.nombre,
        documento: profile.documento,
        correo: profile.correo ?? "",
        telefono: profile.telefono ?? "",
      })
    }
  }, [profile, resetInfo])

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
        <Form onSubmit={handleInfoSubmit(updateProfile)}>
          <FormInput label="Usuario" icon={<User size={18} />} error={infoErrors.nombre?.message} {...registerInfo("nombre")} />
          <FormInput label="Número de documento" icon={<IdCard size={18} />} error={infoErrors.documento?.message} {...registerInfo("documento")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Correo" type="email" icon={<Mail size={18} />} error={infoErrors.correo?.message} {...registerInfo("correo")} />
            <FormInput label="Teléfono" icon={<Phone size={18} />} error={infoErrors.telefono?.message} {...registerInfo("telefono")} />
          </div>
          <FormActions>
            <Button type="submit" loading={saving}>Guardar Cambios</Button>
          </FormActions>
        </Form>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-stone-700 mb-4">Cambiar Contraseña</h3>
        <Form
          onSubmit={handlePwdSubmit(async (data) => {
            await changePassword(data)
            resetPwd()
          })}
        >
          <FormInput label="Nueva contraseña" type="password" placeholder="Mínimo 6 caracteres" icon={<Lock size={18} />} error={pwdErrors.newPassword?.message} {...registerPwd("newPassword")} />
          <FormInput label="Confirmar contraseña" type="password" placeholder="Repite la nueva contraseña" icon={<Lock size={18} />} error={pwdErrors.confirmPassword?.message} {...registerPwd("confirmPassword")} />
          <FormActions>
            <Button type="submit" variant="secondary" loading={saving}>Cambiar Contraseña</Button>
          </FormActions>
        </Form>
      </Card>
    </div>
  )
}

export { PerfilForm }
