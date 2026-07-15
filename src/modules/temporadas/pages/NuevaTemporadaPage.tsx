import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Alert } from "@/components/ui/Alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createTemporadaSchema, type CreateTemporadaFormData } from "../schemas/temporada.schema"
import { temporadaService } from "../services/temporada.service"
import { fincaService } from "@/modules/fincas/services/finca.service"
import { useNotification } from "@/hooks/useNotification"
import { useState, useEffect } from "react"
import { ArrowLeft, Save } from "lucide-react"

interface FincaOption { id: number; nombre: string }

function NuevaTemporadaPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const [fincas, setFincas] = useState<FincaOption[]>([])
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateTemporadaFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createTemporadaSchema) as any,
  })

  useEffect(() => {
    fincaService.findAll().then((res) => {
      const list = Array.isArray(res) ? res : (res as { data: FincaOption[] }).data
      setFincas(list ?? [])
    }).catch(() => {})
  }, [])

  const onSubmit = async (data: CreateTemporadaFormData) => {
    setError(null)
    try {
      await temporadaService.create(data)
      notify({ type: "success", title: "Temporada creada", message: "Temporada registrada correctamente." })
      navigate("/app/temporadas")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear temporada")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Nueva Temporada"
        description="Registra una nueva temporada de producción"
        actions={
          <Link to="/app/temporadas">
            <Button variant="outline">
              <ArrowLeft size={16} />
              Volver
            </Button>
          </Link>
        }
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Nombre" {...register("nombre")} error={errors.nombre?.message} />
          <Input label="Descripción" {...register("descripcion")} error={errors.descripcion?.message} />
          <Input label="Fecha de Inicio" type="date" {...register("fechaInicio")} error={errors.fechaInicio?.message} />
          <Input label="Fecha de Fin" type="date" {...register("fechaFin")} error={errors.fechaFin?.message} />
          <Select label="Finca" options={fincas.map((f) => ({ value: String(f.id), label: f.nombre }))} placeholder="Seleccione una finca" {...register("fincaId")} error={errors.fincaId?.message} />
          <div className="flex justify-end gap-3 pt-4">
            <Link to="/app/temporadas"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default NuevaTemporadaPage
