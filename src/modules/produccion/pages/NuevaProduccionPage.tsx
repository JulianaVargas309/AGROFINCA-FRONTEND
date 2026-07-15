import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Alert } from "@/components/ui/Alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createProduccionSchema, type CreateProduccionFormData } from "../schemas/produccion.schema"
import { produccionService } from "../services/produccion.service"
import { fincaService } from "@/modules/fincas/services/finca.service"
import { cultivoService } from "@/modules/cultivos/services/cultivo.service"
import { loteService } from "@/modules/lotes/services/lote.service"
import { temporadaService } from "@/modules/temporadas/services/temporada.service"
import { useNotification } from "@/hooks/useNotification"
import { useState, useEffect } from "react"
import { ArrowLeft, Save } from "lucide-react"

interface FincaOption { id: number; nombre: string }
interface OptionItem { id: number; nombre: string }

const calidadOptions = [
  { value: "PRIMERA", label: "Primera" },
  { value: "SEGUNDA", label: "Segunda" },
  { value: "TERCERA", label: "Tercera" },
  { value: "ESTANDAR", label: "Estándar" },
]

function NuevaProduccionPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const [fincas, setFincas] = useState<FincaOption[]>([])
  const [cultivos, setCultivos] = useState<OptionItem[]>([])
  const [lotes, setLotes] = useState<OptionItem[]>([])
  const [temporadas, setTemporadas] = useState<OptionItem[]>([])
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CreateProduccionFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createProduccionSchema) as any,
  })

  useEffect(() => {
    fincaService.findAll().then((res) => {
      const list = Array.isArray(res) ? res : (res as { data: FincaOption[] }).data
      setFincas(list ?? [])
    }).catch(() => {})

    cultivoService.findAll().then((res) => {
      const list = Array.isArray(res) ? res : (res as { data: OptionItem[] }).data
      setCultivos(list ?? [])
    }).catch(() => {})

    temporadaService.findAll().then((res) => {
      const list = Array.isArray(res) ? res : (res as { data: OptionItem[] }).data
      setTemporadas(list ?? [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    loteService.findAll().then((res) => {
      setLotes(Array.isArray(res) ? res : [])
    }).catch(() => {})
  }, [])

  const onSubmit = async (data: CreateProduccionFormData) => {
    setError(null)
    try {
      await produccionService.create(data)
      notify({ type: "success", title: "Producción registrada", message: "Producción registrada correctamente." })
      navigate("/app/produccion")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar producción")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Nueva Producción"
        description="Registra una nueva producción o cosecha"
        actions={
          <Link to="/app/produccion">
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
          <Input label="Fecha" type="date" {...register("fecha")} error={errors.fecha?.message} />
          <Input label="Cantidad" type="number" {...register("cantidad")} error={errors.cantidad?.message} />
          <Input label="Unidad" {...register("unidad")} placeholder="ej. kg, qq, lb" error={errors.unidad?.message} />
          <Select label="Calidad" options={calidadOptions} placeholder="Seleccione..." {...register("calidad")} error={errors.calidad?.message} />
          <Input label="Destino" {...register("destino")} error={errors.destino?.message} />
          <Input label="Observaciones" {...register("observaciones")} error={errors.observaciones?.message} />
          <Select label="Temporada" options={temporadas.map((t) => ({ value: String(t.id), label: t.nombre }))} placeholder="Seleccione una temporada" {...register("temporadaId")} error={errors.temporadaId?.message} />
          <Select label="Cultivo" options={cultivos.map((c) => ({ value: String(c.id), label: c.nombre }))} placeholder="Seleccione un cultivo" {...register("cultivoId")} error={errors.cultivoId?.message} />
          <Select label="Lote" options={lotes.map((l) => ({ value: String(l.id), label: l.nombre }))} placeholder="Seleccione un lote" {...register("loteId")} error={errors.loteId?.message} />
          <div className="flex justify-end gap-3 pt-4">
            <Link to="/app/produccion"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default NuevaProduccionPage
