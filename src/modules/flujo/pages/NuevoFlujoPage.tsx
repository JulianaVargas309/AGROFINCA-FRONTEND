import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Form, FormInput, FormSelect, FormTextarea, FormActions } from "@/components/form"
import { Alert } from "@/components/ui/Alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createFlujoSchema, type CreateFlujoFormData } from "../schemas/flujo.schema"
import { flujoService } from "../services/flujo.service"
import { useNotification } from "@/hooks/useNotification"
import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import type { Option } from "@/types"

const tipoOptions: Option[] = [
  { value: "INGRESO", label: "Ingreso" },
  { value: "EGRESO", label: "Egreso" },
]

function NuevoFlujoPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateFlujoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createFlujoSchema) as any,
  })

  const onSubmit = async (data: CreateFlujoFormData) => {
    setError(null)
    try {
      await flujoService.create(data)
      notify({ type: "success", title: "Registro creado", message: "Registro de flujo creado correctamente." })
      navigate("/app/flujo")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el registro")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Nuevo Registro de Flujo" description="Registra un ingreso o egreso" actions={
        <Link to="/app/flujo"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormSelect label="Tipo" options={tipoOptions} placeholder="Seleccione..." {...register("tipo")} error={errors.tipo?.message} />
          <FormInput label="Categoría" {...register("categoria")} error={errors.categoria?.message} placeholder="Ej: Ventas, Insumos, etc." />
          <FormInput label="Monto" type="number" {...register("monto")} error={errors.monto?.message} />
          <FormInput label="Fecha" type="date" {...register("fecha")} error={errors.fecha?.message} />
          <FormTextarea label="Descripción" {...register("descripcion")} error={errors.descripcion?.message} />
          <FormActions>
            <Link to="/app/flujo"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </FormActions>
        </Form>
      </Card>
    </div>
  )
}

export default NuevoFlujoPage
