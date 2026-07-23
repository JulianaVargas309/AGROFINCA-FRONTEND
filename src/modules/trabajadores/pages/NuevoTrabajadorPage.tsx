import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Form, FormInput, FormSelect, FormTextarea, FormActions } from "@/components/form"
import { Alert } from "@/components/ui/Alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createTrabajadorSchema, type CreateTrabajadorFormData } from "../schemas/trabajador.schema"
import { trabajadorService } from "../services/trabajador.service"
import { useNotification } from "@/hooks/useNotification"
import { useState } from "react"
import { BackButton } from "@/components/shared/BackButton"
import { Save } from "lucide-react"
import type { Option } from "@/types"

const cargoOptions: Option[] = [
  { value: "JORNALERO", label: "Jornalero" },
  { value: "ADMINISTRADOR", label: "Administrador" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "OPERARIO", label: "Operario" },
]

function NuevoTrabajadorPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateTrabajadorFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createTrabajadorSchema) as any,
  })

  const onSubmit = async (data: CreateTrabajadorFormData) => {
    setError(null)
    try {
      await trabajadorService.create(data)
      notify({ type: "success", title: "Trabajador creado", message: "Trabajador registrado correctamente." })
      navigate("/app/trabajadores")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear trabajador")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Nuevo Trabajador" description="Registra un nuevo trabajador" actions={<BackButton to="/app/trabajadores" />} />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Nombre" {...register("nombre")} error={errors.nombre?.message} />
            <FormInput label="Apellido" {...register("apellido")} error={errors.apellido?.message} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Documento" {...register("documento")} error={errors.documento?.message} />
            <FormInput label="Teléfono" {...register("telefono")} error={errors.telefono?.message} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Dirección" {...register("direccion")} error={errors.direccion?.message} />
            <FormInput label="Fecha de Ingreso" type="date" {...register("fechaIngreso")} error={errors.fechaIngreso?.message} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormSelect label="Cargo" options={cargoOptions} placeholder="Seleccione..." {...register("cargo")} error={errors.cargo?.message} />
            <FormInput label="Salario" type="number" {...register("salario")} error={errors.salario?.message} />
          </div>
          <FormTextarea label="Observaciones" {...register("observaciones")} error={errors.observaciones?.message} />
          <FormActions>
            <Link to="/app/trabajadores"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </FormActions>
        </Form>
      </Card>
    </div>
  )
}

export default NuevoTrabajadorPage
