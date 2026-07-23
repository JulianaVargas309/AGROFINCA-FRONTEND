import { useParams, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Form, FormInput, FormSelect, FormActions } from "@/components/form"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTemporada } from "../hooks/useTemporada"
import { updateTemporadaSchema, type UpdateTemporadaFormData } from "../schemas/temporada.schema"
import { temporadaService } from "../services/temporada.service"
import { fincaService } from "@/modules/fincas/services/finca.service"
import { useNotification } from "@/hooks/useNotification"
import { formatDate } from "@/utils/formatDate"
import { BackButton } from "@/components/shared/BackButton"
import { Edit, Save, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"

interface FincaOption { id: number; nombre: string }

function DetalleTemporadaPage() {
  const { id } = useParams<{ id: string }>()
  const { temporada, loading, error } = useTemporada(id ? Number(id) : null)
  const { notify } = useNotification()
  const [editing, setEditing] = useState(false)
  const [fincas, setFincas] = useState<FincaOption[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UpdateTemporadaFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(updateTemporadaSchema) as any,
  })

  useEffect(() => {
    fincaService.findAll().then((res) => {
      const list = Array.isArray(res) ? res : (res as { data: FincaOption[] }).data
      setFincas(list ?? [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (temporada) {
      reset({
        nombre: temporada.nombre,
        descripcion: temporada.descripcion,
        fechaInicio: temporada.fechaInicio,
        fechaFin: temporada.fechaFin,
        activo: temporada.activo,
        fincaId: temporada.fincaId,
      })
    }
  }, [temporada, reset])

  const onSubmit = async (data: UpdateTemporadaFormData) => {
    if (!id) return
    setSubmitError(null)
    try {
      await temporadaService.update(Number(id), data)
      notify({ type: "success", title: "Temporada actualizada", message: "Cambios guardados correctamente." })
      setEditing(false)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al actualizar temporada")
    }
  }

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!temporada) return <Alert severity="info">Temporada no encontrada</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title={temporada.nombre}
        description={`${temporada.finca?.nombre || "Sin finca"} · ${temporada.activo ? "Activa" : "Inactiva"}`}
        actions={
          <div className="flex gap-2">
            <BackButton to="/app/temporadas" />
            {editing ? (
              <Link to={`/app/temporadas/${id}`}>
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
            <FormInput label="Nombre" {...register("nombre")} error={errors.nombre?.message} />
            <FormInput label="Descripción" {...register("descripcion")} error={errors.descripcion?.message} />
            <FormInput label="Fecha de Inicio" type="date" {...register("fechaInicio")} error={errors.fechaInicio?.message} />
            <FormInput label="Fecha de Fin" type="date" {...register("fechaFin")} error={errors.fechaFin?.message} />
            <FormSelect label="Finca" options={fincas.map((f) => ({ value: String(f.id), label: f.nombre }))} placeholder="Seleccione una finca" {...register("fincaId")} error={errors.fincaId?.message} />
            <FormActions>
              <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
            </FormActions>
          </Form>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Información General">
            <dl className="space-y-3">
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Nombre</dt><dd className="dark:text-stone-100">{temporada.nombre}</dd></div>
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Descripción</dt><dd>{temporada.descripcion || "-"}</dd></div>
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Estado</dt><dd><Badge color={temporada.activo ? "success" : "default"}>{temporada.activo ? "Activa" : "Inactiva"}</Badge></dd></div>
            </dl>
          </Card>
          <Card title="Fechas">
            <dl className="space-y-3">
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Fecha de Inicio</dt><dd>{formatDate(temporada.fechaInicio)}</dd></div>
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Fecha de Fin</dt><dd>{temporada.fechaFin ? formatDate(temporada.fechaFin) : "-"}</dd></div>
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Finca</dt><dd>{temporada.finca?.nombre || "-"}</dd></div>
            </dl>
          </Card>
        </div>
      )}
    </div>
  )
}

export default DetalleTemporadaPage
