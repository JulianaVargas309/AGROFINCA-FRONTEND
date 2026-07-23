import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Form, FormInput, FormSelect, FormTextarea, FormActions, FormSection, FormLabel } from "@/components/form"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createActividadSchema, type CreateActividadFormData } from "../schemas/actividades.schema"
import { actividadService } from "../services/actividades.service"
import { useNotification } from "@/hooks/useNotification"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import { ESTADO_ACTIVIDAD_OPTIONS } from "../types/actividades.types"
import type { Option } from "@/types"

const estadoOptions: Option[] = ESTADO_ACTIVIDAD_OPTIONS.map((e) => ({ value: e.value, label: e.label }))

function EditarActividadPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const actividadId = id ? Number(id) : null

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<CreateActividadFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createActividadSchema) as any,
  })

  const { fields: evFields, append: appendEv, remove: removeEv } = useFieldArray({ control, name: "evidencias" })
  const { fields: prodFields, append: appendProd, remove: removeProd } = useFieldArray({ control, name: "productosUtilizados" })

  useEffect(() => {
    if (!actividadId) return
    actividadService.findById(actividadId).then((actividad) => {
      reset({
        titulo: actividad.titulo,
        descripcion: actividad.descripcion || "",
        estado: actividad.estado,
        fechaInicio: actividad.fechaInicio ? actividad.fechaInicio.split("T")[0] : "",
        fechaFin: actividad.fechaFin ? actividad.fechaFin.split("T")[0] : "",
        tiempoInvertido: actividad.tiempoInvertido ?? undefined,
        costo: actividad.costo ?? undefined,
        responsableId: actividad.responsableId,
      })
      setLoading(false)
    }).catch((err) => {
      setError(err instanceof Error ? err.message : "Error al cargar la actividad")
      setLoading(false)
    })
  }, [actividadId, reset])

  const onSubmit = async (data: CreateActividadFormData) => {
    if (!actividadId) return
    setError(null)
    try {
      await actividadService.update(actividadId, data)
      notify({ type: "success", title: "Actividad actualizada", message: "Actividad actualizada correctamente." })
      navigate(`/app/actividades/${actividadId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar la actividad")
    }
  }

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Editar Actividad"
        description="Modifica los datos de la actividad"
        actions={
          <Link to={actividadId ? `/app/actividades/${actividadId}` : "/app/actividades"}>
            <Button variant="outline">
              <ArrowLeft size={16} />
              Volver
            </Button>
          </Link>
        }
      />
      <Card>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Título" {...register("titulo")} error={errors.titulo?.message} />
          <FormTextarea label="Descripción" {...register("descripcion")} error={errors.descripcion?.message} />
          <FormSelect label="Estado" options={estadoOptions} placeholder="Seleccione..." {...register("estado")} error={errors.estado?.message} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Fecha de Inicio" type="date" {...register("fechaInicio")} error={errors.fechaInicio?.message} />
            <FormInput label="Fecha de Fin" type="date" {...register("fechaFin")} error={errors.fechaFin?.message} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Tiempo Invertido (horas)" type="number" {...register("tiempoInvertido")} error={errors.tiempoInvertido?.message} />
            <FormInput label="Costo" type="number" {...register("costo")} error={errors.costo?.message} />
          </div>
          <FormInput label="Responsable ID" type="number" {...register("responsableId")} error={errors.responsableId?.message} />

          <FormSection title="Evidencias">
            <div className="flex items-center justify-between">
              <FormLabel>Evidencias</FormLabel>
              <Button type="button" variant="outline" size="sm" onClick={() => appendEv({ url: "", tipo: "", descripcion: "" })}>
                <Plus size={14} /> Agregar
              </Button>
            </div>
            {evFields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2 p-3 rounded-lg border border-stone-200">
                <div className="flex-1 space-y-2">
                  <FormInput placeholder="URL" {...register(`evidencias.${index}.url`)} error={errors.evidencias?.[index]?.url?.message} />
                  <FormInput placeholder="Tipo (imagen, documento, etc)" {...register(`evidencias.${index}.tipo`)} error={errors.evidencias?.[index]?.tipo?.message} />
                  <FormInput placeholder="Descripción" {...register(`evidencias.${index}.descripcion`)} />
                </div>
                <button type="button" onClick={() => removeEv(index)} className="mt-2 rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 cursor-pointer">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </FormSection>

          <FormSection title="Productos Utilizados">
            <div className="flex items-center justify-between">
              <FormLabel>Productos Utilizados</FormLabel>
              <Button type="button" variant="outline" size="sm" onClick={() => appendProd({ cantidad: 0, productoId: 0 })}>
                <Plus size={14} /> Agregar
              </Button>
            </div>
            {prodFields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2 p-3 rounded-lg border border-stone-200">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <FormInput type="number" placeholder="Cantidad" {...register(`productosUtilizados.${index}.cantidad`)} error={errors.productosUtilizados?.[index]?.cantidad?.message} />
                  <FormInput type="number" placeholder="Producto ID" {...register(`productosUtilizados.${index}.productoId`)} error={errors.productosUtilizados?.[index]?.productoId?.message} />
                </div>
                <button type="button" onClick={() => removeProd(index)} className="mt-2 rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 cursor-pointer">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </FormSection>
          <FormActions>
            <Link to={actividadId ? `/app/actividades/${actividadId}` : "/app/actividades"}>
              <Button type="button" variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              <Save size={16} />{isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </FormActions>
        </Form>
      </Card>
    </div>
  )
}

export default EditarActividadPage
