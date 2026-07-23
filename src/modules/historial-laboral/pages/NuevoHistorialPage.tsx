import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Form, FormInput, FormSelect, FormTextarea, FormActions } from "@/components/form"
import { Alert } from "@/components/ui/Alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createHistorialSchema, type CreateHistorialFormData } from "../schemas/historial-laboral.schema"
import { historialLaboralService } from "../services/historial-laboral.service"
import { trabajadorService } from "@/modules/trabajadores/services/trabajador.service"
import { useNotification } from "@/hooks/useNotification"
import { useState, useEffect } from "react"
import { ArrowLeft, Save } from "lucide-react"
import type { Option } from "@/types"

const tipoOptions: Option[] = [
  { value: "CAPACITACION", label: "Capacitación" },
  { value: "INCIDENCIA", label: "Incidencia" },
  { value: "ASCENSO", label: "Ascenso" },
  { value: "SANCION", label: "Sanción" },
  { value: "RECONOCIMIENTO", label: "Reconocimiento" },
  { value: "OTRO", label: "Otro" },
]

function NuevoHistorialPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const [trabajadores, setTrabajadores] = useState<Option[]>([])
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateHistorialFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createHistorialSchema) as any,
  })

  useEffect(() => {
    trabajadorService.findAll().then((res) => {
      const list = Array.isArray(res) ? res : (res as { data: { id: number; nombre: string }[] }).data
      setTrabajadores((list ?? []).map((t: { id: number; nombre: string }) => ({ value: String(t.id), label: t.nombre })))
    }).catch(() => {})
  }, [])

  const onSubmit = async (data: CreateHistorialFormData) => {
    setError(null)
    try {
      await historialLaboralService.create(data)
      notify({ type: "success", title: "Registro creado", message: "Historial registrado correctamente." })
      navigate("/app/historial-laboral")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear registro")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Nuevo Registro" description="Agregar registro al historial laboral" actions={
        <Link to="/app/historial-laboral"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormSelect label="Tipo" options={tipoOptions} placeholder="Seleccione..." {...register("tipo")} error={errors.tipo?.message} />
          <FormTextarea label="Descripción" {...register("descripcion")} error={errors.descripcion?.message} />
          <FormInput label="Fecha" type="date" {...register("fecha")} error={errors.fecha?.message} />
          <FormTextarea label="Observaciones" {...register("observaciones")} error={errors.observaciones?.message} />
          <FormSelect label="Trabajador" options={trabajadores} placeholder="Seleccione un trabajador" {...register("trabajadorId")} error={errors.trabajadorId?.message} />
          <FormActions>
            <Link to="/app/historial-laboral"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </FormActions>
        </Form>
      </Card>
    </div>
  )
}

export default NuevoHistorialPage
