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
import { createActividadAsignadaSchema, type CreateActividadFormData } from "../schemas/actividades-asignadas.schema"
import { actividadAsignadaService } from "../services/actividades-asignadas.service"
import { trabajadorService } from "@/modules/trabajadores/services/trabajador.service"
import { loteService } from "@/modules/lotes/services/lote.service"
import { cultivoService } from "@/modules/cultivos/services/cultivo.service"
import { useNotification } from "@/hooks/useNotification"
import { useState, useEffect } from "react"
import { ArrowLeft, Save } from "lucide-react"
import type { Option } from "@/types"

const estadoOptions: Option[] = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "EN_PROGRESO", label: "En Progreso" },
  { value: "COMPLETADA", label: "Completada" },
  { value: "CANCELADA", label: "Cancelada" },
]

const prioridadOptions: Option[] = [
  { value: "BAJA", label: "Baja" },
  { value: "MEDIA", label: "Media" },
  { value: "ALTA", label: "Alta" },
  { value: "URGENTE", label: "Urgente" },
]

function NuevaActividadPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const [trabajadores, setTrabajadores] = useState<Option[]>([])
  const [lotes, setLotes] = useState<Option[]>([])
  const [cultivos, setCultivos] = useState<Option[]>([])
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateActividadFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createActividadAsignadaSchema) as any,
    defaultValues: { estado: "PENDIENTE", prioridad: "MEDIA" },
  })

  useEffect(() => {
    trabajadorService.findAll().then((res) => {
      const list = Array.isArray(res) ? res : (res as { data: { id: number; nombre: string }[] }).data
      setTrabajadores((list ?? []).map((t: { id: number; nombre: string }) => ({ value: String(t.id), label: t.nombre })))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    loteService.findAll().then((res) => {
      const list = Array.isArray(res) ? res : (res as { data: { id: number; nombre: string }[] }).data
      setLotes((list ?? []).map((l: { id: number; nombre: string }) => ({ value: String(l.id), label: l.nombre })))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    cultivoService.findAll().then((res) => {
      const list = Array.isArray(res) ? res : (res as { data: { id: number; nombre: string }[] }).data
      setCultivos((list ?? []).map((c: { id: number; nombre: string }) => ({ value: String(c.id), label: c.nombre })))
    }).catch(() => {})
  }, [])

  const onSubmit = async (data: CreateActividadFormData) => {
    setError(null)
    try {
      await actividadAsignadaService.create(data)
      notify({ type: "success", title: "Actividad creada", message: "Actividad registrada correctamente." })
      navigate("/app/actividades-asignadas")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear actividad")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Nueva Actividad" description="Asignar una nueva actividad a un trabajador" actions={
        <Link to="/app/actividades-asignadas"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Título" {...register("titulo")} error={errors.titulo?.message} />
          <Textarea label="Descripción" {...register("descripcion")} error={errors.descripcion?.message} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Estado" options={estadoOptions} placeholder="Seleccione..." {...register("estado")} error={errors.estado?.message} />
            <Select label="Prioridad" options={prioridadOptions} placeholder="Seleccione..." {...register("prioridad")} error={errors.prioridad?.message} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Fecha de Asignación" type="date" {...register("fechaAsignacion")} error={errors.fechaAsignacion?.message} />
            <Input label="Fecha de Inicio" type="date" {...register("fechaInicio")} error={errors.fechaInicio?.message} />
          </div>
          <Input label="Fecha de Fin" type="date" {...register("fechaFin")} error={errors.fechaFin?.message} />
          <Select label="Trabajador" options={trabajadores} placeholder="Seleccione un trabajador" {...register("trabajadorId")} error={errors.trabajadorId?.message} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Lote (opcional)" options={[{ value: "", label: "Sin lote" }, ...lotes]} placeholder="Seleccione..." {...register("loteId")} error={errors.loteId?.message} />
            <Select label="Cultivo (opcional)" options={[{ value: "", label: "Sin cultivo" }, ...cultivos]} placeholder="Seleccione..." {...register("cultivoId")} error={errors.cultivoId?.message} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Link to="/app/actividades-asignadas"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default NuevaActividadPage
