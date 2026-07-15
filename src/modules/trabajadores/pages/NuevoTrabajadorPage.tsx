import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Alert } from "@/components/ui/Alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createTrabajadorSchema, type CreateTrabajadorFormData } from "../schemas/trabajador.schema"
import { trabajadorService } from "../services/trabajador.service"
import { useNotification } from "@/hooks/useNotification"
import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
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
      <PageHeader title="Nuevo Trabajador" description="Registra un nuevo trabajador" actions={
        <Link to="/app/trabajadores"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nombre" {...register("nombre")} error={errors.nombre?.message} />
            <Input label="Apellido" {...register("apellido")} error={errors.apellido?.message} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Documento" {...register("documento")} error={errors.documento?.message} />
            <Input label="Teléfono" {...register("telefono")} error={errors.telefono?.message} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Correo" type="email" {...register("correo")} error={errors.correo?.message} />
            <Input label="Dirección" {...register("direccion")} error={errors.direccion?.message} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Fecha de Nacimiento" type="date" {...register("fechaNacimiento")} error={errors.fechaNacimiento?.message} />
            <Input label="Fecha de Ingreso" type="date" {...register("fechaIngreso")} error={errors.fechaIngreso?.message} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Cargo" options={cargoOptions} placeholder="Seleccione..." {...register("cargo")} error={errors.cargo?.message} />
            <Input label="Salario" type="number" {...register("salario")} error={errors.salario?.message} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="EPS" {...register("eps")} error={errors.eps?.message} />
            <Input label="ARL" {...register("arl")} error={errors.arl?.message} />
          </div>
          <Textarea label="Observaciones" {...register("observaciones")} error={errors.observaciones?.message} />
          <div className="flex justify-end gap-3 pt-4">
            <Link to="/app/trabajadores"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default NuevoTrabajadorPage
