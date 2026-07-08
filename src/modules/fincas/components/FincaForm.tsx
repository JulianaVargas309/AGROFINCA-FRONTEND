import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { createFincaSchema, updateFincaSchema, type CreateFincaFormData, type UpdateFincaFormData } from "../schemas/finca.schema"
import { MapPin, Ruler, Sprout } from "lucide-react"

interface FincaFormProps {
  defaultValues?: Partial<CreateFincaFormData>
  onSubmit: (data: CreateFincaFormData | UpdateFincaFormData) => Promise<void>
  loading?: boolean
  error?: string | null
  onClearError?: () => void
  submitLabel?: string
  mode: "create" | "edit"
}

function FincaForm({
  defaultValues,
  onSubmit,
  loading,
  error,
  onClearError,
  submitLabel = "Guardar",
  mode,
}: FincaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFincaFormData>({
    resolver: zodResolver(
      mode === "create" ? createFincaSchema : updateFincaSchema,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any,
    defaultValues: {
      nombre: defaultValues?.nombre ?? "",
      ubicacion: defaultValues?.ubicacion ?? "",
      hectareas: defaultValues?.hectareas ?? undefined,
      descripcion: defaultValues?.descripcion ?? "",
    },
  })

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as CreateFincaFormData))} className="space-y-5">
      {error && (
        <Alert severity="error" onClose={onClearError}>
          {error}
        </Alert>
      )}

      <Input
        label="Nombre de la finca"
        placeholder="Ej: Finca El Paraíso"
        icon={<Sprout size={18} />}
        error={errors.nombre?.message}
        {...register("nombre")}
      />

      <Input
        label="Ubicación"
        placeholder="Ej: Vereda La Esperanza, km 5"
        icon={<MapPin size={18} />}
        error={errors.ubicacion?.message}
        {...register("ubicacion")}
      />

      <Input
        label="Hectáreas"
        type="number"
        step="0.01"
        placeholder="0.00"
        icon={<Ruler size={18} />}
        error={errors.hectareas?.message}
        {...register("hectareas")}
      />

      <Textarea
        label="Descripción"
        placeholder="Describe la finca..."
        error={errors.descripcion?.message}
        rows={3}
        {...register("descripcion")}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export { FincaForm }
export type { FincaFormProps }
