import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
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
          <Input label="Nombre Completo" {...register("nombre")} error={errors.nombre?.message} />
          <Input label="Documento" {...register("documento")} error={errors.documento?.message} />
          <Input label="Teléfono" {...register("telefono")} error={errors.telefono?.message} />
          <Input label="Dirección" {...register("direccion")} error={errors.direccion?.message} />
          <Select label="Cargo" options={cargoOptions} placeholder="Seleccione..." {...register("cargo")} error={errors.cargo?.message} />
          <Input label="Fecha de Ingreso" type="date" {...register("fechaIngreso")} error={errors.fechaIngreso?.message} />
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
