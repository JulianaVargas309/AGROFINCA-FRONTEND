import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormInput, FormSelect, FormActions } from "@/components/form"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Card } from "@/components/ui/Card"
import { createUserSchema, updateUserSchema, type CreateUserFormData, type UpdateUserFormData } from "../schemas/user.schema"
import { Save, IdCard, Mail, Phone, Lock } from "lucide-react"
import type { Option } from "@/types"
import { useState, useRef } from "react"

const rolOptions: Option[] = [
  { value: "ADMIN", label: "Admin" },
  { value: "FAMILIAR", label: "Familiar" },
  { value: "TRABAJADOR", label: "Trabajador" },
  { value: "CONSULTA", label: "Consulta" },
]

interface UserFormProps {
  defaultValues?: Partial<CreateUserFormData | UpdateUserFormData>
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => Promise<void>
  isEdit?: boolean
}

function UserForm({ defaultValues, onSubmit, isEdit }: UserFormProps) {
  const [error, setError] = useState<string | null>(null)
  const passwordTouched = useRef(false)
  const schema = isEdit ? updateUserSchema : createUserSchema

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<CreateUserFormData | UpdateUserFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: defaultValues as any,
  })

  const handleFormSubmit = async (data: CreateUserFormData | UpdateUserFormData) => {
    setError(null)
    try {
      await onSubmit(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar usuario")
    }
  }

  return (
    <Card>
      {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput label="Nombre" {...register("nombre")} error={(errors as any).nombre?.message} />
          <FormInput label="Apellido" {...register("apellido")} error={(errors as any).apellido?.message} />
        </div>
        <FormInput label="Documento" icon={<IdCard size={18} />} {...register("documento", { onChange: (e) => { if (!isEdit && !passwordTouched.current) { setValue("password" as any, e.target.value as any) } } })} error={(errors as any).documento?.message} disabled={isEdit} helperText="Se usa como usuario para iniciar sesión. La contraseña se autocompleta con este valor." />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput label="Correo" type="email" icon={<Mail size={18} />} {...register("correo")} error={(errors as any).correo?.message} />
          <FormInput label="Teléfono" icon={<Phone size={18} />} {...register("telefono")} error={(errors as any).telefono?.message} />
        </div>
        {!isEdit && (
          <FormInput label="Contraseña" type="password" icon={<Lock size={18} />} autoComplete="new-password" {...register("password", { onChange: () => { passwordTouched.current = true } })} error={(errors as any).password?.message} helperText="Por defecto se asigna el número de documento. Si la cambias manualmente, el documento ya no la sobreescribirá." />
        )}
        <FormSelect label="Rol" options={rolOptions} placeholder="Seleccione..." {...register("rol")} error={(errors as any).rol?.message} />
        <FormActions>
          <Button type="submit" disabled={isSubmitting}>
            <Save size={16} />
            {isSubmitting ? "Guardando..." : isEdit ? "Actualizar" : "Guardar"}
          </Button>
        </FormActions>
      </Form>
    </Card>
  )
}

export { UserForm }
