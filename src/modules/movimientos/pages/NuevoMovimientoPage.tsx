import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Form, FormInput, FormSelect, FormTextarea, FormActions } from "@/components/form"
import { Alert } from "@/components/ui/Alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createMovimientoSchema, type CreateMovimientoFormData } from "../schemas/movimiento.schema"
import { movimientoService } from "../services/movimiento.service"
import { useNotification } from "@/hooks/useNotification"
import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import type { Option } from "@/types"

const tipoOptions: Option[] = [
  { value: "ENTRADA", label: "Entrada" },
  { value: "SALIDA", label: "Salida" },
]

const unidadOptions: Option[] = [
  { value: "KG", label: "Kilogramos" },
  { value: "LB", label: "Libras" },
  { value: "UN", label: "Unidades" },
  { value: "LTS", label: "Litros" },
]

function NuevoMovimientoPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateMovimientoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createMovimientoSchema) as any,
  })

  const onSubmit = async (data: CreateMovimientoFormData) => {
    setError(null)
    try {
      await movimientoService.create(data)
      notify({ type: "success", title: "Movimiento creado", message: "Movimiento registrado correctamente." })
      navigate("/app/movimientos")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear movimiento")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Nuevo Movimiento" description="Registra entrada o salida de inventario" actions={
        <Link to="/app/movimientos"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormSelect label="Tipo" options={tipoOptions} placeholder="Seleccione..." {...register("tipo")} error={errors.tipo?.message} />
          <FormInput label="Cantidad" type="number" {...register("cantidad")} error={errors.cantidad?.message} />
          <FormSelect label="Unidad de Medida" options={unidadOptions} placeholder="Seleccione..." {...register("unidadMedida")} error={errors.unidadMedida?.message} />
          <FormInput label="Fecha" type="date" {...register("fecha")} error={errors.fecha?.message} />
          <FormInput label="ID Producto" type="number" {...register("productoId")} error={errors.productoId?.message} />
          <FormInput label="ID Lote" type="number" {...register("loteId")} error={errors.loteId?.message} />
          <FormTextarea label="Descripción" {...register("descripcion")} error={errors.descripcion?.message} />
          <FormActions>
            <Link to="/app/movimientos"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </FormActions>
        </Form>
      </Card>
    </div>
  )
}

export default NuevoMovimientoPage
