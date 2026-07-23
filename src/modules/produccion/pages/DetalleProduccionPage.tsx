import { useParams, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Form, FormInput, FormSelect, FormActions } from "@/components/form"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useProduccion } from "../hooks/useProduccion"
import { updateProduccionSchema, type UpdateProduccionFormData } from "../schemas/produccion.schema"
import { produccionService } from "../services/produccion.service"
import { cultivoService } from "@/modules/cultivos/services/cultivo.service"
import { loteService } from "@/modules/lotes/services/lote.service"
import { temporadaService } from "@/modules/temporadas/services/temporada.service"
import { useNotification } from "@/hooks/useNotification"
import { formatDate } from "@/utils/formatDate"
import { BackButton } from "@/components/shared/BackButton"
import { Edit, Save, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"

interface OptionItem { id: number; nombre: string }

const calidadOptions = [
  { value: "PRIMERA", label: "Primera" },
  { value: "SEGUNDA", label: "Segunda" },
  { value: "TERCERA", label: "Tercera" },
  { value: "ESTANDAR", label: "Estándar" },
]

function DetalleProduccionPage() {
  const { id } = useParams<{ id: string }>()
  const { produccion, loading, error } = useProduccion(id ? Number(id) : null)
  const { notify } = useNotification()
  const [editing, setEditing] = useState(false)
  const [cultivos, setCultivos] = useState<OptionItem[]>([])
  const [lotes, setLotes] = useState<OptionItem[]>([])
  const [temporadas, setTemporadas] = useState<OptionItem[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UpdateProduccionFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(updateProduccionSchema) as any,
  })

  useEffect(() => {
    cultivoService.findAll().then((res) => {
      const list = Array.isArray(res) ? res : (res as { data: OptionItem[] }).data
      setCultivos(list ?? [])
    }).catch(() => {})

    loteService.findAll().then((res) => {
      setLotes(Array.isArray(res) ? res : [])
    }).catch(() => {})

    temporadaService.findAll().then((res) => {
      const list = Array.isArray(res) ? res : (res as { data: OptionItem[] }).data
      setTemporadas(list ?? [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (produccion) {
      reset({
        fecha: produccion.fecha,
        cantidad: produccion.cantidad,
        unidad: produccion.unidad,
        calidad: produccion.calidad,
        destino: produccion.destino,
        observaciones: produccion.observaciones,
        temporadaId: produccion.temporadaId,
        cultivoId: produccion.cultivoId,
        loteId: produccion.loteId,
      })
    }
  }, [produccion, reset])

  const onSubmit = async (data: UpdateProduccionFormData) => {
    if (!id) return
    setSubmitError(null)
    try {
      await produccionService.update(Number(id), data)
      notify({ type: "success", title: "Producción actualizada", message: "Cambios guardados correctamente." })
      setEditing(false)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al actualizar producción")
    }
  }

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!produccion) return <Alert severity="info">Producción no encontrada</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title={`Producción - ${formatDate(produccion.fecha)}`}
        description={`${produccion.cultivo?.nombre || "Sin cultivo"} · ${produccion.cantidad} ${produccion.unidad || ""}`}
        actions={
          <div className="flex gap-2">
            <BackButton to="/app/produccion" />
            {editing ? (
              <Link to={`/app/produccion/${id}`}>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  <ArrowLeft size={16} />
                  Cancelar
                </Button>
              </Link>
            ) : (
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit size={16} />
                Editar
              </Button>
            )}
          </div>
        }
      />
      {submitError && <Alert severity="error">{submitError}</Alert>}
      {editing ? (
        <Card>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormInput label="Fecha" type="date" {...register("fecha")} error={errors.fecha?.message} />
            <FormInput label="Cantidad" type="number" {...register("cantidad")} error={errors.cantidad?.message} />
            <FormInput label="Unidad" {...register("unidad")} placeholder="ej. kg, qq, lb" error={errors.unidad?.message} />
            <FormSelect label="Calidad" options={calidadOptions} placeholder="Seleccione..." {...register("calidad")} error={errors.calidad?.message} />
            <FormInput label="Destino" {...register("destino")} error={errors.destino?.message} />
            <FormInput label="Observaciones" {...register("observaciones")} error={errors.observaciones?.message} />
            <FormSelect label="Temporada" options={temporadas.map((t) => ({ value: String(t.id), label: t.nombre }))} placeholder="Seleccione una temporada" {...register("temporadaId")} error={errors.temporadaId?.message} />
            <FormSelect label="Cultivo" options={cultivos.map((c) => ({ value: String(c.id), label: c.nombre }))} placeholder="Seleccione un cultivo" {...register("cultivoId")} error={errors.cultivoId?.message} />
            <FormSelect label="Lote" options={lotes.map((l) => ({ value: String(l.id), label: l.nombre }))} placeholder="Seleccione un lote" {...register("loteId")} error={errors.loteId?.message} />
            <FormActions>
              <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
            </FormActions>
          </Form>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Información de Producción">
            <dl className="space-y-3">
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Fecha</dt><dd className="dark:text-stone-100">{formatDate(produccion.fecha)}</dd></div>
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Cantidad</dt><dd>{produccion.cantidad} {produccion.unidad || ""}</dd></div>
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Calidad</dt><dd>{produccion.calidad || "-"}</dd></div>
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Destino</dt><dd>{produccion.destino || "-"}</dd></div>
            </dl>
          </Card>
          <Card title="Referencias">
            <dl className="space-y-3">
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Cultivo</dt><dd>{produccion.cultivo?.nombre || "-"}</dd></div>
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Lote</dt><dd>{produccion.lote?.nombre || "-"}</dd></div>
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Temporada</dt><dd>{produccion.temporada?.nombre || "-"}</dd></div>
            </dl>
          </Card>
          {produccion.observaciones && (
            <Card title="Observaciones" className="md:col-span-2">
              <p className="text-sm text-stone-600 dark:text-stone-300">{produccion.observaciones}</p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default DetalleProduccionPage
