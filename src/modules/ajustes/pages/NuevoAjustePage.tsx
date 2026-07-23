import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Form, FormInput, FormSelect, FormTextarea, FormActions } from "@/components/form"
import { Alert } from "@/components/ui/Alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createAjusteSchema, type CreateAjusteFormData } from "../schemas/ajuste.schema"
import { ajusteService } from "../services/ajuste.service"
import { apiGet } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import { useNotification } from "@/hooks/useNotification"
import { useState, useEffect } from "react"
import { ArrowLeft, Save } from "lucide-react"
import type { Option } from "@/types"

const tipoOptions: Option[] = [
  { value: "entrada", label: "Entrada" },
  { value: "salida", label: "Salida" },
]

function NuevoAjustePage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const [productos, setProductos] = useState<Option[]>([])
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateAjusteFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createAjusteSchema) as any,
  })

  useEffect(() => {
    apiGet<{ id: number; nombre: string }[]>(API_ENDPOINTS.PRODUCTOS).then((res) => {
      const list = Array.isArray(res) ? res : (res as unknown as { data: { id: number; nombre: string }[] }).data
      setProductos((list ?? []).map((p: { id: number; nombre: string }) => ({ value: String(p.id), label: p.nombre })))
    }).catch(() => {})
  }, [])

  const onSubmit = async (data: CreateAjusteFormData) => {
    setError(null)
    try {
      await ajusteService.create(data)
      notify({ type: "success", title: "Ajuste creado", message: "Ajuste registrado correctamente." })
      navigate("/app/ajustes")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear ajuste")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Nuevo Ajuste" description="Registra un ajuste de inventario" actions={
        <Link to="/app/ajustes"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormSelect label="Tipo" options={tipoOptions} placeholder="Seleccione..." {...register("tipo")} error={errors.tipo?.message} />
          <FormInput label="Cantidad" type="number" {...register("cantidad")} error={errors.cantidad?.message} />
          <FormTextarea label="Motivo" {...register("motivo")} error={errors.motivo?.message} />
          <FormSelect label="Producto" options={productos} placeholder="Seleccione un producto" {...register("productoId")} error={errors.productoId?.message} />
          <FormActions>
            <Link to="/app/ajustes"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </FormActions>
        </Form>
      </Card>
    </div>
  )
}

export default NuevoAjustePage
