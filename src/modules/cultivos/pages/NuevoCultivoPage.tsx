import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Alert } from "@/components/ui/Alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createCultivoSchema, type CreateCultivoFormData } from "../schemas/cultivo.schema"
import { cultivoService } from "../services/cultivo.service"
import { fincaService } from "@/modules/fincas/services/finca.service"
import { loteService } from "@/modules/lotes/services/lote.service"
import { useNotification } from "@/hooks/useNotification"
import { useState, useEffect } from "react"
import { ArrowLeft, Save } from "lucide-react"
import type { Option } from "@/types"

interface FincaOption { id: number; nombre: string }
interface LoteOption { id: number; nombre: string }

const tipoOptions: Option[] = [
  { value: "CAFE", label: "Café" },
  { value: "CAÑA", label: "Caña de Azúcar" },
]

const estadoOptions: Option[] = [
  { value: "ACTIVO", label: "Activo" },
  { value: "CRECIMIENTO", label: "Crecimiento" },
  { value: "COSECHA", label: "Cosecha" },
  { value: "FINALIZADO", label: "Finalizado" },
]

function NuevoCultivoPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const [fincas, setFincas] = useState<FincaOption[]>([])
  const [lotes, setLotes] = useState<LoteOption[]>([])
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CreateCultivoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createCultivoSchema) as any,
  })

  const fincaIdWatch = watch("fincaId")

  useEffect(() => {
    fincaService.findAll().then((res) => {
      const list = Array.isArray(res) ? res : (res as { data: FincaOption[] }).data
      setFincas(list ?? [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!fincaIdWatch) { setLotes([]); return }
    loteService.findAll(Number(fincaIdWatch)).then((res) => {
      const list = Array.isArray(res) ? res : (res as { data: LoteOption[] }).data
      setLotes(list ?? [])
    }).catch(() => setLotes([]))
  }, [fincaIdWatch])

  const onSubmit = async (data: CreateCultivoFormData) => {
    setError(null)
    try {
      await cultivoService.create(data)
      notify({ type: "success", title: "Cultivo creado", message: "Cultivo registrado correctamente." })
      navigate("/app/cultivos")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear cultivo")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Nuevo Cultivo"
        description="Registra un nuevo cultivo"
        actions={
          <Link to="/app/cultivos">
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
          <Select label="Tipo" options={tipoOptions} placeholder="Seleccione..." {...register("tipo")} error={errors.tipo?.message} />
          <Input label="Variedad" {...register("variedad")} error={errors.variedad?.message} />
          <Input label="Fecha de Siembra" type="date" {...register("fechaSiembra")} error={errors.fechaSiembra?.message} />
          <Input label="Área Sembrada (ha)" type="number" {...register("areaSembrada")} error={errors.areaSembrada?.message} />
          <Select label="Estado" options={estadoOptions} placeholder="Seleccione..." {...register("estado")} error={errors.estado?.message} />
          <Select label="Finca" options={fincas.map((f) => ({ value: String(f.id), label: f.nombre }))} placeholder="Seleccione una finca" {...register("fincaId")} error={errors.fincaId?.message} />
          <Select label="Lote" options={lotes.map((l) => ({ value: String(l.id), label: l.nombre }))} placeholder={fincaIdWatch ? "Seleccione un lote" : "Primero seleccione una finca"} {...register("loteId")} error={errors.loteId?.message} disabled={!fincaIdWatch} />
          <div className="flex justify-end gap-3 pt-4">
            <Link to="/app/cultivos"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default NuevoCultivoPage
