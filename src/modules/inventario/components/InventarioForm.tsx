import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormInput, FormTextarea, FormSelect, FormActions } from "@/components/form"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { createProductoSchema, updateProductoSchema, type CreateProductoFormData, type UpdateProductoFormData } from "../schemas/inventario.schema"
import { CATEGORIA_PRODUCTO_OPTIONS, UNIDAD_MEDIDA_OPTIONS } from "@/constants/inventario"
import { Package } from "lucide-react"

interface InventarioFormProps {
  defaultValues?: Partial<CreateProductoFormData>
  onSubmit: (data: CreateProductoFormData | UpdateProductoFormData) => Promise<void>
  loading?: boolean
  error?: string | null
  onClearError?: () => void
  submitLabel?: string
  mode: "create" | "edit"
}

function InventarioForm({ defaultValues, onSubmit, loading, error, onClearError, submitLabel = "Guardar", mode }: InventarioFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(mode === "create" ? createProductoSchema : updateProductoSchema) as any,
    defaultValues: {
      nombre: defaultValues?.nombre ?? "",
      descripcion: defaultValues?.descripcion ?? "",
      categoria: defaultValues?.categoria ?? "",
      unidadMedida: defaultValues?.unidadMedida ?? "unidad",
      stockActual: defaultValues?.stockActual ?? 0,
      stockMinimo: defaultValues?.stockMinimo ?? 0,
      precioUnitario: defaultValues?.precioUnitario ?? undefined,
    },
  })

  return (
    <Form onSubmit={handleSubmit((data) => onSubmit(data as CreateProductoFormData))}>
      {error && <Alert severity="error" onClose={onClearError}>{error}</Alert>}

      <FormInput label="Nombre del producto" placeholder="Ej: Fertilizante NPK" icon={<Package size={18} />} error={errors.nombre?.message} {...register("nombre")} />
      <FormTextarea label="Descripción" placeholder="Describe el producto..." error={errors.descripcion?.message} rows={2} {...register("descripcion")} />
      <FormSelect label="Categoría" options={CATEGORIA_PRODUCTO_OPTIONS} placeholder="Selecciona una categoría" error={errors.categoria?.message} {...register("categoria")} />
      <FormSelect label="Unidad de medida" options={UNIDAD_MEDIDA_OPTIONS} error={errors.unidadMedida?.message} {...register("unidadMedida")} />
      <div className="grid grid-cols-2 gap-4">
        <FormInput label="Stock actual" type="number" error={errors.stockActual?.message} {...register("stockActual")} />
        <FormInput label="Stock mínimo" type="number" error={errors.stockMinimo?.message} {...register("stockMinimo")} />
      </div>
      <FormInput label="Precio unitario" type="number" step="0.01" placeholder="0.00" error={errors.precioUnitario?.message} {...register("precioUnitario")} />
      <FormActions>
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </FormActions>
    </Form>
  )
}

export { InventarioForm }
export type { InventarioFormProps }
