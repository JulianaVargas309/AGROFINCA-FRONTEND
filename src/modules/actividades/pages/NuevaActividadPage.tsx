import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Form, FormInput, FormSelect, FormTextarea, FormSection, FormActions } from "@/components/form"
import { Alert } from "@/components/ui/Alert"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createActividadSchema, type CreateActividadFormData } from "../schemas/actividades.schema"
import { actividadService } from "../services/actividades.service"
import { useNotification } from "@/hooks/useNotification"
import { useState } from "react"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import { ESTADO_ACTIVIDAD_OPTIONS } from "../types/actividades.types"
import type { Option } from "@/types"

const estadoOptions: Option[] = ESTADO_ACTIVIDAD_OPTIONS.map((e) => ({ value: e.value, label: e.label }))

function NuevaActividadPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<CreateActividadFormData>({
    resolver: zodResolver(createActividadSchema) as any,
    defaultValues: { evidencias: [], productosUtilizados: [] },
  })

  const { fields: evFields, append: appendEv, remove: removeEv } = useFieldArray({ control, name: "evidencias" })
  const { fields: prodFields, append: appendProd, remove: removeProd } = useFieldArray({ control, name: "productosUtilizados" })

  const onSubmit = async (data: CreateActividadFormData) => {
    setError(null)
    try {
      await actividadService.create(data)
      notify({ type: "success", title: "Actividad creada", message: "Actividad registrada correctamente." })
      navigate("/app/actividades")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear actividad")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Nueva Actividad"
        description="Registra una nueva actividad de seguimiento"
        actions={
          <Link to="/app/actividades">
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
              <div />
              <Button type="button" variant="outline" size="sm" onClick={() => appendEv({ url: "", tipo: "", descripcion: "" })}>
                <Plus size={14} /> Agregar
              </Button>
            </div>
            {evFields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2 p-3 rounded-lg border border-stone-200 dark:border-stone-700">
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
              <div />
              <Button type="button" variant="outline" size="sm" onClick={() => appendProd({ cantidad: 0, productoId: 0 })}>
                <Plus size={14} /> Agregar
              </Button>
            </div>
            {prodFields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2 p-3 rounded-lg border border-stone-200 dark:border-stone-700">
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
            <Link to="/app/actividades"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </FormActions>
        </Form>
      </Card>
    </div>
  )
}

export default NuevaActividadPage
