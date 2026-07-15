import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Alert } from "@/components/ui/Alert"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createCompraSchema, type CreateCompraFormData } from "../schemas/compra.schema"
import { compraService } from "../services/compra.service"
import { apiGet } from "@/services/api"
import { API_ENDPOINTS } from "@/constants/api"
import { useNotification } from "@/hooks/useNotification"
import { useState, useEffect } from "react"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"

interface ProveedorOption { id: number; nombre: string }
interface ProductoOption { id: number; nombre: string }

function NuevaCompraPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const [proveedores, setProveedores] = useState<ProveedorOption[]>([])
  const [productos, setProductos] = useState<ProductoOption[]>([])

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<CreateCompraFormData>({
    resolver: zodResolver(createCompraSchema) as any,
    defaultValues: { detalles: [{ productoId: undefined, cantidad: undefined, precioUnitario: undefined }] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: "detalles" })

  useEffect(() => {
    apiGet<ProveedorOption[]>(API_ENDPOINTS.PROVEEDORES).then((res) => {
      const list = Array.isArray(res) ? res : (res as unknown as { data: ProveedorOption[] }).data
      setProveedores(list ?? [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    apiGet<ProductoOption[]>(API_ENDPOINTS.PRODUCTOS).then((res) => {
      const list = Array.isArray(res) ? res : (res as unknown as { data: ProductoOption[] }).data
      setProductos(list ?? [])
    }).catch(() => {})
  }, [])

  const onSubmit = async (data: CreateCompraFormData) => {
    setError(null)
    try {
      await compraService.create(data)
      notify({ type: "success", title: "Compra creada", message: "Compra registrada correctamente." })
      navigate("/app/compras")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear compra")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Nueva Compra" description="Registra una compra de insumos" actions={
        <Link to="/app/compras"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Número de Factura" {...register("numeroFactura")} error={errors.numeroFactura?.message} />
          <Input label="Fecha" type="date" {...register("fecha")} error={errors.fecha?.message} />
          <Select label="Proveedor" options={proveedores.map((p) => ({ value: String(p.id), label: p.nombre }))} placeholder="Seleccione un proveedor" {...register("proveedorId")} error={errors.proveedorId?.message} />
          <Textarea label="Observaciones" {...register("observaciones")} error={errors.observaciones?.message} />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-stone-700">Detalles de Compra</label>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ productoId: undefined, cantidad: undefined, precioUnitario: undefined })}>
                <Plus size={14} />Agregar
              </Button>
            </div>
            {errors.detalles?.message && <p className="text-sm text-red-500">{errors.detalles.message}</p>}
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2 p-3 bg-stone-50 rounded-lg">
                <div className="flex-1">
                  <Select label="Producto" options={productos.map((p) => ({ value: String(p.id), label: p.nombre }))} placeholder="Seleccione..." {...register(`detalles.${index}.productoId` as const)} error={errors.detalles?.[index]?.productoId?.message} />
                </div>
                <div className="w-24">
                  <Input label="Cantidad" type="number" {...register(`detalles.${index}.cantidad` as const)} error={errors.detalles?.[index]?.cantidad?.message} />
                </div>
                <div className="w-32">
                  <Input label="Precio Unit." type="number" step="0.01" {...register(`detalles.${index}.precioUnitario` as const)} error={errors.detalles?.[index]?.precioUnitario?.message} />
                </div>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={16} /></button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link to="/app/compras"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default NuevaCompraPage
