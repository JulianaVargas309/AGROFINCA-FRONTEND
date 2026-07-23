import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Form, FormInput, FormSelect, FormTextarea, FormActions } from "@/components/form"
import { Alert } from "@/components/ui/Alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createVentaSchema, type CreateVentaFormData } from "../schemas/venta.schema"
import { ventaService } from "../services/venta.service"
import { useNotification } from "@/hooks/useNotification"
import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import type { Option } from "@/types"

const tipoProductoOptions: Option[] = [
  { value: "CAFE", label: "Café" },
  { value: "CAÑA", label: "Caña de Azúcar" },
]

const unidadOptions: Option[] = [
  { value: "KG", label: "Kilogramos" },
  { value: "LB", label: "Libras" },
  { value: "UN", label: "Unidades" },
]

function NuevaVentaPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateVentaFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createVentaSchema) as any,
  })

  const onSubmit = async (data: CreateVentaFormData) => {
    setError(null)
    try {
      await ventaService.create(data)
      notify({ type: "success", title: "Venta creada", message: "Venta registrada correctamente." })
      navigate("/app/ventas")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear venta")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Nueva Venta" description="Registra una venta" actions={
        <Link to="/app/ventas"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Fecha" type="date" {...register("fecha")} error={errors.fecha?.message} />
          <FormInput label="Cliente" {...register("cliente")} error={errors.cliente?.message} />
          <FormSelect label="Tipo de Producto" options={tipoProductoOptions} placeholder="Seleccione..." {...register("tipoProducto")} error={errors.tipoProducto?.message} />
          <FormInput label="Cantidad" type="number" {...register("cantidad")} error={errors.cantidad?.message} />
          <FormSelect label="Unidad de Medida" options={unidadOptions} placeholder="Seleccione..." {...register("unidadMedida")} error={errors.unidadMedida?.message} />
          <FormInput label="Precio Unitario" type="number" {...register("precioUnitario")} error={errors.precioUnitario?.message} />
          <FormTextarea label="Descripción" {...register("descripcion")} error={errors.descripcion?.message} />
          <FormActions>
            <Link to="/app/ventas"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </FormActions>
        </Form>
      </Card>
    </div>
  )
}

export default NuevaVentaPage
