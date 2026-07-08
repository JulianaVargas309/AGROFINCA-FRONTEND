import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { createGastoSchema, updateGastoSchema, CATEGORIA_GASTO_OPTIONS, type CreateGastoFormData, type UpdateGastoFormData } from "../schemas/finanza.schema"
import { finanzaService } from "../services/finanza.service"
import { formatInputDate } from "@/utils/formatDate"
import { DollarSign, Calendar } from "lucide-react"
import { useState, useEffect } from "react"

interface LoteOption { id: number; nombre: string; fincaId: number }
interface CultivoOption { id: number; nombre: string; loteId: number }

interface GastoFormProps {
  defaultValues?: Partial<CreateGastoFormData>
  onSubmit: (data: CreateGastoFormData | UpdateGastoFormData) => Promise<void>
  loading?: boolean
  error?: string | null
  onClearError?: () => void
  submitLabel?: string
  mode: "create" | "edit"
}

function GastoForm({ defaultValues, onSubmit, loading, error, onClearError, submitLabel = "Guardar", mode }: GastoFormProps) {
  const [lotes, setLotes] = useState<LoteOption[]>([])
  const [cultivos, setCultivos] = useState<CultivoOption[]>([])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateGastoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(mode === "create" ? createGastoSchema : updateGastoSchema) as any,
    defaultValues: {
      descripcion: defaultValues?.descripcion ?? "",
      monto: defaultValues?.monto ?? undefined,
      categoria: (defaultValues?.categoria ?? "") as CreateGastoFormData["categoria"],
      fecha: defaultValues?.fecha ? formatInputDate(defaultValues.fecha) : formatInputDate(new Date()),
      proveedorId: defaultValues?.proveedorId ?? undefined,
      cultivoId: defaultValues?.cultivoId ?? undefined,
      fincaId: defaultValues?.fincaId ?? undefined,
      loteId: defaultValues?.loteId ?? undefined,
    },
  })

  const loteIdWatch = watch("loteId")

  useEffect(() => {
    finanzaService.fetchFincas().then(async (f) => {
      const all = await Promise.all(f.map((fin) => finanzaService.fetchLotes(fin.id).catch(() => [] as LoteOption[])))
      setLotes(all.flat())
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const lid = Number(loteIdWatch)
    if (lid) finanzaService.fetchCultivos(lid).then(setCultivos).catch(() => {})
  }, [loteIdWatch])

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as unknown as CreateGastoFormData))} className="space-y-5">
      {error && <Alert severity="error" onClose={onClearError}>{error}</Alert>}
      <Input label="Descripción" placeholder="Ej: Compra de fertilizante" error={errors.descripcion?.message} {...register("descripcion")} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Monto ($)" type="number" step="0.01" icon={<DollarSign size={18} />} error={errors.monto?.message} {...register("monto")} />
        <Input label="Fecha" type="date" icon={<Calendar size={18} />} error={errors.fecha?.message} {...register("fecha")} />
      </div>
      <Select label="Categoría" options={CATEGORIA_GASTO_OPTIONS} placeholder="Selecciona una categoría" error={errors.categoria?.message} {...register("categoria")} />
      <Select label="Lote (opcional)" options={lotes.map((l) => ({ value: String(l.id), label: l.nombre }))} placeholder="Ninguno" {...register("loteId")} />
      {cultivos.length > 0 && (
        <Select label="Cultivo (opcional)" options={cultivos.map((c) => ({ value: String(c.id), label: c.nombre }))} placeholder="Ninguno" {...register("cultivoId")} />
      )}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  )
}

export { GastoForm }
export type { GastoFormProps }
