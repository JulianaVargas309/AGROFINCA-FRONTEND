import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormInput, FormTextarea, FormSelect, FormActions } from "@/components/form"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { createBitacoraSchema, updateBitacoraSchema, ACTIVIDAD_OPTIONS, type CreateBitacoraFormData, type UpdateBitacoraFormData } from "../schemas/bitacora.schema"
import { bitacoraService } from "../services/bitacora.service"
import { formatInputDate } from "@/utils/formatDate"
import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"

interface LoteOption { id: number; nombre: string; fincaId: number }
interface CultivoOption { id: number; nombre: string; tipo: string; loteId: number }
interface ProductoOption { id: number; nombre: string }

interface BitacoraFormProps {
  defaultValues?: Partial<CreateBitacoraFormData>
  onSubmit: (data: CreateBitacoraFormData | UpdateBitacoraFormData) => Promise<void>
  loading?: boolean
  error?: string | null
  onClearError?: () => void
  submitLabel?: string
  mode: "create" | "edit"
}

function BitacoraForm({ defaultValues, onSubmit, loading, error, onClearError, submitLabel = "Guardar", mode }: BitacoraFormProps) {
  const [lotes, setLotes] = useState<LoteOption[]>([])
  const [cultivosF, setCultivosF] = useState<CultivoOption[]>([])
  const [productosF, setProductosF] = useState<ProductoOption[]>([])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateBitacoraFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(mode === "create" ? createBitacoraSchema : updateBitacoraSchema) as any,
    defaultValues: {
      fecha: defaultValues?.fecha ? formatInputDate(defaultValues.fecha) : formatInputDate(new Date()),
      actividad: (defaultValues?.actividad as CreateBitacoraFormData["actividad"]) ?? "FERTILIZACION",
      descripcion: defaultValues?.descripcion ?? "",
      cantidad: defaultValues?.cantidad ?? undefined,
      unidadMedida: defaultValues?.unidadMedida ?? "",
      costo: defaultValues?.costo ?? 0,
      observaciones: defaultValues?.observaciones ?? "",
      loteId: defaultValues?.loteId ?? undefined,
      cultivoId: defaultValues?.cultivoId ?? undefined,
      productoId: defaultValues?.productoId ?? undefined,
    },
  })

  const loteIdWatch = watch("loteId")

  useEffect(() => { bitacoraService.fetchProductos().then(setProductosF).catch(() => {}) }, [])

  useEffect(() => {
    bitacoraService.fetchFincas().then((fincas) => {
      const fincaList = Array.isArray(fincas) ? fincas as Array<{ id: number }> : []
      if (fincaList.length === 0) return
      Promise.all(fincaList.map((f) =>
        bitacoraService.fetchLotes(f.id).catch(() => [] as LoteOption[])
      )).then((results) => {
        setLotes(results.flat().filter(Boolean) as LoteOption[])
      })
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const lid = Number(loteIdWatch)
    if (lid) bitacoraService.fetchCultivos(lid).then(setCultivosF).catch(() => {})
  }, [loteIdWatch])

  return (
    <Form onSubmit={handleSubmit((data) => onSubmit(data as CreateBitacoraFormData))}>
      {error && <Alert severity="error" onClose={onClearError}>{error}</Alert>}

      <div className="grid grid-cols-2 gap-4">
        <FormInput label="Fecha" type="date" icon={<Calendar size={18} />} error={errors.fecha?.message} {...register("fecha")} />
        <FormSelect label="Actividad" options={ACTIVIDAD_OPTIONS} error={errors.actividad?.message} {...register("actividad")} />
      </div>

      <FormTextarea label="Descripción" placeholder="Describe la actividad realizada..." error={errors.descripcion?.message} rows={3} {...register("descripcion")} />

      <FormSelect label="Lote" options={lotes.map((l) => ({ value: String(l.id), label: l.nombre }))} placeholder="Selecciona un lote" error={errors.loteId?.message} {...register("loteId")} />

      {cultivosF.length > 0 && (
        <FormSelect label="Cultivo (opcional)" options={cultivosF.map((c) => ({ value: String(c.id), label: `${c.nombre} (${c.tipo})` }))} placeholder="Todos" {...register("cultivoId")} />
      )}

      <FormSelect label="Producto usado (opcional)" options={productosF.map((p) => ({ value: String(p.id), label: p.nombre }))} placeholder="Ninguno" {...register("productoId")} />

      <div className="grid grid-cols-3 gap-4">
        <FormInput label="Cantidad" type="number" step="0.01" error={errors.cantidad?.message} {...register("cantidad")} />
        <FormInput label="Unidad" placeholder="kg, L..." error={errors.unidadMedida?.message} {...register("unidadMedida")} />
        <FormInput label="Costo ($)" type="number" step="0.01" error={errors.costo?.message} {...register("costo")} />
      </div>

      <FormTextarea label="Observaciones" placeholder="Notas adicionales..." error={errors.observaciones?.message} rows={2} {...register("observaciones")} />

      <FormActions>
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </FormActions>
    </Form>
  )
}

export { BitacoraForm }
export type { BitacoraFormProps }
