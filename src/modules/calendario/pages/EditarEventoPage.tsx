import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createEventoSchema, type CreateEventoFormData } from "../schemas/calendario.schema"
import { calendarioService } from "../services/calendario.service"
import { useNotification } from "@/hooks/useNotification"
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

function EditarEventoPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const eventoId = id ? Number(id) : null

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateEventoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createEventoSchema) as any,
  })

  useEffect(() => {
    if (!eventoId) return
    calendarioService.findById(eventoId).then((evento) => {
      reset({
        titulo: evento.titulo,
        descripcion: evento.descripcion || "",
        tipo: evento.tipo,
        fechaInicio: evento.fechaInicio.split("T")[0],
        fechaFin: evento.fechaFin ? evento.fechaFin.split("T")[0] : "",
        todoElDia: evento.todoElDia,
        estado: evento.estado,
        prioridad: evento.prioridad,
        color: evento.color || "",
        ubicacion: evento.ubicacion || "",
        fincaId: evento.fincaId,
        loteId: evento.loteId,
        cultivoId: evento.cultivoId,
      })
      setLoading(false)
    }).catch((err) => {
      setError(err instanceof Error ? err.message : "Error al cargar el evento")
      setLoading(false)
    })
  }, [eventoId, reset])

  const onSubmit = async (data: CreateEventoFormData) => {
    if (!eventoId) return
    setError(null)
    try {
      await calendarioService.update(eventoId, data)
      notify({ type: "success", title: "Evento actualizado", message: "Evento actualizado correctamente." })
      navigate(`/app/calendario/${eventoId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar el evento")
    }
  }

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Editar Evento"
        description="Modifica los datos del evento"
        actions={
          <Link to={eventoId ? `/app/calendario/${eventoId}` : "/app/calendario"}>
            <Button variant="outline">
              <ArrowLeft size={16} />
              Volver
            </Button>
          </Link>
        }
      />
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Título" {...register("titulo")} error={errors.titulo?.message} />
          <Textarea label="Descripción" {...register("descripcion")} error={errors.descripcion?.message} />
          <Select label="Tipo" options={tipoOptions} placeholder="Seleccione..." {...register("tipo")} error={errors.tipo?.message} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Fecha de Inicio" type="date" {...register("fechaInicio")} error={errors.fechaInicio?.message} />
            <Input label="Fecha de Fin" type="date" {...register("fechaFin")} error={errors.fechaFin?.message} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("todoElDia")} className="rounded border-stone-300" />
            Todo el día
          </label>
          <Select label="Estado" options={estadoOptions} placeholder="Seleccione..." {...register("estado")} error={errors.estado?.message} />
          <Select label="Prioridad" options={prioridadOptions} placeholder="Seleccione..." {...register("prioridad")} error={errors.prioridad?.message} />
          <Input label="Color (hex)" type="color" {...register("color")} />
          <Input label="Ubicación" {...register("ubicacion")} error={errors.ubicacion?.message} />
          <div className="flex justify-end gap-3 pt-4">
            <Link to={eventoId ? `/app/calendario/${eventoId}` : "/app/calendario"}>
              <Button type="button" variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              <Save size={16} />{isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default EditarEventoPage
