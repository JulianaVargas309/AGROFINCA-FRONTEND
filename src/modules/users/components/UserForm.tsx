import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Card } from "@/components/ui/Card"
import { createUserSchema, updateUserSchema, type CreateUserFormData, type UpdateUserFormData } from "../schemas/user.schema"
import { Save, IdCard, Mail, Phone, Lock } from "lucide-react"
import type { Option } from "@/types"
import { useState } from "react"

const rolOptions: Option[] = [
  { value: "ADMIN", label: "Admin" },
  { value: "FAMILIAR", label: "Familiar" },
  { value: "CONSULTA", label: "Consulta" },
]

interface UserFormProps {
  defaultValues?: Partial<CreateUserFormData | UpdateUserFormData>
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => Promise<void>
  isEdit?: boolean
}

function UserForm({ defaultValues, onSubmit, isEdit }: UserFormProps) {
  const [error, setError] = useState<string | null>(null)
  const schema = isEdit ? updateUserSchema : createUserSchema

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateUserFormData | UpdateUserFormData>({
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
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Input label="Nombre" {...register("nombre")} error={(errors as any).nombre?.message} />
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Input label="Apellido" {...register("apellido")} error={(errors as any).apellido?.message} />
        </div>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Input label="Documento" icon={<IdCard size={18} />} {...register("documento")} error={(errors as any).documento?.message} disabled={isEdit} />
        <div className="grid gap-4 sm:grid-cols-2">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Input label="Correo" type="email" icon={<Mail size={18} />} {...register("correo")} error={(errors as any).correo?.message} />
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Input label="Teléfono" icon={<Phone size={18} />} {...register("telefono")} error={(errors as any).telefono?.message} />
        </div>
        {!isEdit && (
          <Input label="Contraseña" type="password" icon={<Lock size={18} />} {...register("password")} error={(errors as any).password?.message} />
        )}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Select label="Rol" options={rolOptions} placeholder="Seleccione..." {...register("rol")} error={(errors as any).rol?.message} />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            <Save size={16} />
            {isSubmitting ? "Guardando..." : isEdit ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export { UserForm }
