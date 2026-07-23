import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Form, FormInput, FormSelect, FormTextarea, FormActions } from "@/components/form"
import { Alert } from "@/components/ui/Alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createEventoSchema, type CreateEventoFormData } from "../schemas/calendario.schema"
import { calendarioService } from "../services/calendario.service"
import { useNotification } from "@/hooks/useNotification"
import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import { TIPO_EVENTO_OPTIONS, PRIORIDAD_OPTIONS } from "../types/calendario.types"
import type { Option } from "@/types"

const tipoOptions: Option[] = TIPO_EVENTO_OPTIONS.map((t) => ({ value: t.value, label: t.label }))
const prioridadOptions: Option[] = PRIORIDAD_OPTIONS.map((p) => ({ value: p.value, label: p.label }))
const estadoOptions: Option[] = [
  { value: "PROGRAMADO", label: "Programado" },
  { value: "EN_CURSO", label: "En Curso" },
  { value: "COMPLETADO", label: "Completado" },
  { value: "CANCELADO", label: "Cancelado" },
]

function NuevoEventoPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateEventoFormData>({
    resolver: zodResolver(createEventoSchema) as any,
    defaultValues: { todoElDia: false },
  })

  const onSubmit = async (data: CreateEventoFormData) => {
    setError(null)
    try {
      await calendarioService.create(data)
      notify({ type: "success", title: "Evento creado", message: "Evento registrado correctamente." })
      navigate("/app/calendario")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear evento")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Nuevo Evento"
        description="Registra un nuevo evento en el calendario agrícola"
        actions={
          <Link to="/app/calendario">
            <Button variant="outline">
              <ArrowLeft size={16} />
              Volver
            </Button>
          </Link>
        }
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Título" {...register("titulo")} error={errors.titulo?.message} />
          <FormTextarea label="Descripción" {...register("descripcion")} error={errors.descripcion?.message} />
          <FormSelect label="Tipo" options={tipoOptions} placeholder="Seleccione..." {...register("tipo")} error={errors.tipo?.message} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Fecha de Inicio" type="date" {...register("fechaInicio")} error={errors.fechaInicio?.message} />
            <FormInput label="Fecha de Fin" type="date" {...register("fechaFin")} error={errors.fechaFin?.message} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("todoElDia")} className="rounded border-stone-300" />
            Todo el día
          </label>
          <FormSelect label="Estado" options={estadoOptions} placeholder="Seleccione..." {...register("estado")} error={errors.estado?.message} />
          <FormSelect label="Prioridad" options={prioridadOptions} placeholder="Seleccione..." {...register("prioridad")} error={errors.prioridad?.message} />
          <FormInput label="Color (hex)" type="color" {...register("color")} />
          <FormInput label="Ubicación" {...register("ubicacion")} error={errors.ubicacion?.message} />
          <FormActions>
            <Link to="/app/calendario"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </FormActions>
        </Form>
      </Card>
    </div>
  )
}

export default NuevoEventoPage
