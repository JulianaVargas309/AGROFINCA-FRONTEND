import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { createVentaSchema, type CreateVentaFormData } from "../schemas/finanza.schema"
import { finanzaService } from "../services/finanza.service"
import { Plus, Trash2, Package } from "lucide-react"
import { useState, useEffect } from "react"

interface ClienteOption { id: number; nombre: string }
interface ProductoOption { id: number; nombre: string; precioUnitario?: number }

interface VentaFormProps {
  onSubmit: (data: CreateVentaFormData) => Promise<void>
  loading?: boolean
}

function VentaForm({ onSubmit, loading }: VentaFormProps) {
  const [clientes, setClientes] = useState<ClienteOption[]>([])
  const [productos, setProductos] = useState<ProductoOption[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    finanzaService.fetchClientes().then(setClientes).catch(() => {})
    finanzaService.fetchProductos().then(setProductos).catch(() => {})
  }, [])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateVentaFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createVentaSchema) as any,
    defaultValues: {
      clienteId: undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      detalles: [{ productoId: undefined as any, cantidad: undefined as any, precioUnitario: undefined as any }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: "detalles" })

  const handleFormSubmit = async (data: CreateVentaFormData) => {
    setError(null)
    try {
      await onSubmit(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar venta")
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {error && <Alert severity="error">{error}</Alert>}

      <Select
        label="Cliente"
        options={clientes.map((c) => ({ value: String(c.id), label: c.nombre }))}
        placeholder="Selecciona un cliente"
        error={errors.clienteId?.message}
        {...register("clienteId")}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-stone-700">Detalles de la venta</h4>
          <Button type="button" variant="outline" size="sm" onClick={() => append(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { productoId: undefined as any, cantidad: undefined as any, precioUnitario: undefined as any })}>
            <Plus size={14} /> Producto
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2 p-3 border border-stone-200 rounded-lg">
            <Select
              options={productos.map((p) => ({ value: String(p.id), label: p.nombre }))}
              placeholder="Producto"
              className="flex-1"
              error={errors.detalles?.[index]?.productoId?.message}
              {...register(`detalles.${index}.productoId`)}
            />
            <Input
              type="number"
              placeholder="Cantidad"
              className="w-24"
              error={errors.detalles?.[index]?.cantidad?.message}
              {...register(`detalles.${index}.cantidad`)}
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Precio $"
              className="w-24"
              error={errors.detalles?.[index]?.precioUnitario?.message}
              {...register(`detalles.${index}.precioUnitario`)}
            />
            <button type="button" onClick={() => remove(index)} className="p-2 text-stone-400 hover:text-red-600 cursor-pointer">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {errors.detalles?.message && <p className="text-xs text-red-600">{errors.detalles.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}><Package size={16} />Registrar Venta</Button>
      </div>
    </form>
  )
}

export { VentaForm }
