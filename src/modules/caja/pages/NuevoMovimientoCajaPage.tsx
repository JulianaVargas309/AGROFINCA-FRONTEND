import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { Alert } from "@/components/ui/Alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createMovimientoSchema, type CreateMovimientoFormData } from "../schemas/caja.schema"
import { cajaService } from "../services/caja.service"
import { useNotification } from "@/hooks/useNotification"
import { useState, useEffect } from "react"
import { ArrowLeft, Save } from "lucide-react"
import type { Caja } from "../types/caja.types"
import type { Option } from "@/types"

const tipoOptions: Option[] = [
  { value: "INGRESO", label: "Ingreso" },
  { value: "EGRESO", label: "Egreso" },
  { value: "TRASLADO", label: "Traslado" },
]

function NuevoMovimientoCajaPage() {
  const navigate = useNavigate()
  const { id: cajaIdParam } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const tipoQuery = searchParams.get("tipo") || ""
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const [cajas, setCajas] = useState<Caja[]>([])
  const [cargandoCajas, setCargandoCajas] = useState(true)
  const cajaId = cajaIdParam ? Number(cajaIdParam) : null

  useEffect(() => {
    cajaService.findAllCajas().then((data) => {
      setCajas(data)
    }).catch(() => {
      // If the specific caja doesn't load, we'll show empty
    }).finally(() => {
      setCargandoCajas(false)
    })
  }, [])

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CreateMovimientoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createMovimientoSchema) as any,
    defaultValues: {
      tipo: (tipoQuery === "INGRESO" || tipoQuery === "EGRESO" || tipoQuery === "TRASLADO") ? tipoQuery as "INGRESO" | "EGRESO" | "TRASLADO" : undefined,
      cajaId: cajaId ?? undefined,
    },
  })

  const selectedTipo = watch("tipo")

  const onSubmit = async (data: CreateMovimientoFormData) => {
    setError(null)
    try {
      await cajaService.createMovimiento(data)
      notify({ type: "success", title: "Movimiento registrado", message: "Movimiento registrado correctamente." })
      navigate(`/app/caja/${data.cajaId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar el movimiento")
    }
  }

  const cajaOptions: Option[] = cajas.map((c) => ({ value: String(c.id), label: c.nombre }))
  const selectedCaja = cajas.find((c) => c.id === Number(watch("cajaId")))

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title={selectedCaja ? `Nuevo movimiento - ${selectedCaja.nombre}` : "Nuevo Movimiento"}
        description="Registra un movimiento en la caja"
        actions={
          <Link to={cajaId ? `/app/caja/${cajaId}` : "/app/caja"}>
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
          <Select
            label="Caja"
            options={cajaOptions}
            placeholder="Seleccione la caja..."
            {...register("cajaId")}
            error={errors.cajaId?.message}
            disabled={!!cajaId}
          />
          <Select
            label="Tipo de Movimiento"
            options={tipoOptions}
            placeholder="Seleccione el tipo..."
            {...register("tipo")}
            error={errors.tipo?.message}
            disabled={!!tipoQuery}
          />
          <Input
            label="Monto"
            type="number"
            step="0.01"
            {...register("monto")}
            error={errors.monto?.message}
          />
          <Input
            label="Concepto"
            {...register("concepto")}
            error={errors.concepto?.message}
            placeholder="Describe el motivo del movimiento"
          />
          <Input
            label="Referencia (opcional)"
            {...register("referencia")}
            error={errors.referencia?.message}
            placeholder="Factura, recibo, etc."
          />
          <div className="flex justify-end gap-3 pt-4">
            <Link to={cajaId ? `/app/caja/${cajaId}` : "/app/caja"}>
              <Button type="button" variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting || cargandoCajas}>
              <Save size={16} />
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default NuevoMovimientoCajaPage
