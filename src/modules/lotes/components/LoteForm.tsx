import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormInput, FormTextarea, FormSelect, FormActions } from "@/components/form"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { createLoteSchema, updateLoteSchema, type CreateLoteFormData, type UpdateLoteFormData } from "../schemas/lote.schema"
import { Sprout, Ruler } from "lucide-react"
import { useState, useEffect } from "react"
import { loteService } from "../services/lote.service"

interface FincaOption {
  id: number
  nombre: string
}

interface LoteFormProps {
  defaultValues?: Partial<CreateLoteFormData>
  onSubmit: (data: CreateLoteFormData | UpdateLoteFormData) => Promise<void>
  loading?: boolean
  error?: string | null
  onClearError?: () => void
  submitLabel?: string
  mode: "create" | "edit"
  showFincaSelector?: boolean
}

function LoteForm({
  defaultValues,
  onSubmit,
  loading,
  error,
  onClearError,
  submitLabel = "Guardar",
  mode,
  showFincaSelector = true,
}: LoteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLoteFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(mode === "create" ? createLoteSchema : updateLoteSchema) as any,
    defaultValues: {
      nombre: defaultValues?.nombre ?? "",
      area: defaultValues?.area ?? undefined,
      descripcion: defaultValues?.descripcion ?? "",
      fincaId: defaultValues?.fincaId ?? undefined,
    },
  })

  const [fincas, setFincas] = useState<FincaOption[]>([])
  const [loadingFincas, setLoadingFincas] = useState(showFincaSelector)

  useEffect(() => {
    if (!showFincaSelector) return
    loteService.fetchFincas().then(setFincas).finally(() => setLoadingFincas(false))
  }, [showFincaSelector])

  return (
    <Form onSubmit={handleSubmit((data) => onSubmit(data as CreateLoteFormData))}>
      {error && (
        <Alert severity="error" onClose={onClearError}>
          {error}
        </Alert>
      )}

      <FormInput
        label="Nombre del lote"
        placeholder="Ej: Lote 1 - Café"
        icon={<Sprout size={18} />}
        error={errors.nombre?.message}
        {...register("nombre")}
      />

      {showFincaSelector && (
        <FormSelect
          label="Finca"
          options={fincas.map((f) => ({ value: String(f.id), label: f.nombre }))}
          placeholder={loadingFincas ? "Cargando..." : "Selecciona una finca"}
          error={errors.fincaId?.message}
          disabled={loadingFincas}
          {...register("fincaId")}
        />
      )}

      <FormInput
        label="Área (hectáreas)"
        type="number"
        step="0.01"
        placeholder="0.00"
        icon={<Ruler size={18} />}
        error={errors.area?.message}
        {...register("area")}
      />

      <FormTextarea
        label="Descripción"
        placeholder="Describe el lote..."
        error={errors.descripcion?.message}
        rows={3}
        {...register("descripcion")}
      />

      <FormActions>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </FormActions>
    </Form>
  )
}

export { LoteForm }
export type { LoteFormProps }
