import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Form, FormInput, FormTextarea, FormActions } from "@/components/form"
import { Alert } from "@/components/ui/Alert"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createPresupuestoSchema } from "../schemas/presupuestos.schema"
import { presupuestoService } from "../services/presupuestos.service"
import { useNotification } from "@/hooks/useNotification"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"

type PartidaItem = { concepto: string; montoPrevisto: number; categoria?: string }

interface FormValues {
  nombre: string
  descripcion?: string
  periodoInicio: string
  periodoFin: string
  fincaId?: number
  partidas: PartidaItem[]
}

function NuevoPresupuestoPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createPresupuestoSchema) as any,
    defaultValues: { partidas: [{ concepto: "", montoPrevisto: 0, categoria: "" }] },
  })
  const { fields, append, remove } = useFieldArray({ control, name: "partidas" })

  const onSubmit = async (data: FormValues) => {
    setError(null)
    try {
      await presupuestoService.create({
        nombre: data.nombre,
        descripcion: data.descripcion || undefined,
        periodoInicio: data.periodoInicio,
        periodoFin: data.periodoFin,
        fincaId: data.fincaId || undefined,
        partidas: data.partidas.map((p) => ({
          concepto: p.concepto,
          montoPrevisto: p.montoPrevisto,
          categoria: p.categoria || undefined,
        })),
      })
      notify({ type: "success", title: "Presupuesto creado", message: "Presupuesto creado correctamente." })
      navigate("/app/presupuestos")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear presupuesto")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Nuevo Presupuesto" description="Crea un presupuesto con partidas" actions={
        <Link to="/app/presupuestos"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Nombre" {...register("nombre")} error={errors.nombre?.message} />
          <FormTextarea label="Descripción" {...register("descripcion")} error={errors.descripcion?.message} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Período Inicio" type="date" {...register("periodoInicio")} error={errors.periodoInicio?.message} />
            <FormInput label="Período Fin" type="date" {...register("periodoFin")} error={errors.periodoFin?.message} />
          </div>
          <FormInput label="ID de Finca (opcional)" type="number" {...register("fincaId")} error={errors.fincaId?.message} />

          <div className="pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-stone-700">Partidas</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ concepto: "", montoPrevisto: 0, categoria: "" })}>
                <Plus size={14} />Agregar Partida
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-3 mb-3 p-3 rounded-lg border border-stone-200 dark:border-stone-700">
                <div className="flex-1">
                  <FormInput placeholder="Concepto" {...register(`partidas.${index}.concepto`)} error={errors.partidas?.[index]?.concepto?.message} />
                </div>
                <div className="w-36">
                  <FormInput placeholder="Monto" type="number" {...register(`partidas.${index}.montoPrevisto`)} error={errors.partidas?.[index]?.montoPrevisto?.message} />
                </div>
                <div className="w-32">
                  <FormInput placeholder="Categoría" {...register(`partidas.${index}.categoria`)} />
                </div>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} className="mt-1.5 rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            {errors.partidas?.message && <p className="text-sm text-red-600">{errors.partidas.message}</p>}
          </div>

          <FormActions>
            <Link to="/app/presupuestos"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </FormActions>
        </Form>
      </Card>
    </div>
  )
}

export default NuevoPresupuestoPage
