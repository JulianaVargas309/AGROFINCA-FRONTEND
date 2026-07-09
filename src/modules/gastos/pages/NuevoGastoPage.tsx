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
import { createGastoSchema, type CreateGastoFormData } from "../schemas/gasto.schema"
import { gastoService } from "../services/gasto.service"
import { useNotification } from "@/hooks/useNotification"
import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import type { Option } from "@/types"

const categoriaOptions: Option[] = [
  { value: "INSUMOS", label: "Insumos" },
  { value: "HERRAMIENTAS", label: "Herramientas" },
  { value: "MANTENIMIENTO", label: "Mantenimiento" },
  { value: "SERVICIOS", label: "Servicios" },
  { value: "TRANSPORTE", label: "Transporte" },
  { value: "OTROS", label: "Otros" },
]

function NuevoGastoPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateGastoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createGastoSchema) as any,
  })

  const onSubmit = async (data: CreateGastoFormData) => {
    setError(null)
    try {
      await gastoService.create(data)
      notify({ type: "success", title: "Gasto creado", message: "Gasto registrado correctamente." })
      navigate("/app/gastos")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear gasto")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Nuevo Gasto" description="Registra un gasto" actions={
        <Link to="/app/gastos"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Fecha" type="date" {...register("fecha")} error={errors.fecha?.message} />
          <Select label="Categoría" options={categoriaOptions} placeholder="Seleccione..." {...register("categoria")} error={errors.categoria?.message} />
          <Textarea label="Descripción" {...register("descripcion")} error={errors.descripcion?.message} />
          <Input label="Monto" type="number" {...register("monto")} error={errors.monto?.message} />
          <Input label="Proveedor" {...register("proveedor")} error={errors.proveedor?.message} />
          <Input label="Comprobante" {...register("comprobante")} error={errors.comprobante?.message} />
          <Input label="ID Lote" type="number" {...register("loteId")} error={errors.loteId?.message} />
          <div className="flex justify-end gap-3 pt-4">
            <Link to="/app/gastos"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default NuevoGastoPage
