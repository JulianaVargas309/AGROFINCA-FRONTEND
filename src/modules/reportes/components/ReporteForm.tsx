import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import { Input } from "@/components/ui/Input"
import { REPORT_TYPES, type ReportType } from "../types/reporte.types"
import type { Option } from "@/types"

const reportTypeOptions: Option[] = REPORT_TYPES.map((rt) => ({ value: rt.value, label: rt.label }))

const reporteFormSchema = z.object({
  tipo: z.string().min(1, "Seleccione un tipo de reporte"),
  fechaDesde: z.string().optional().or(z.literal("")),
  fechaHasta: z.string().optional().or(z.literal("")),
})

type ReporteFormData = z.infer<typeof reporteFormSchema>

interface ReporteFormProps {
  onSubmit: (data: { tipo: ReportType; fechaDesde?: string; fechaHasta?: string }) => void
  loading?: boolean
}

function ReporteForm({ onSubmit, loading }: ReporteFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ReporteFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(reporteFormSchema) as any,
  })

  const handleFormSubmit = (data: ReporteFormData) => {
    onSubmit({
      tipo: data.tipo as ReportType,
      fechaDesde: data.fechaDesde || undefined,
      fechaHasta: data.fechaHasta || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Select
        label="Tipo de Reporte"
        options={reportTypeOptions}
        placeholder="Seleccione..."
        {...register("tipo")}
        error={errors.tipo?.message}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Fecha Desde" type="date" {...register("fechaDesde")} error={errors.fechaDesde?.message} />
        <Input label="Fecha Hasta" type="date" {...register("fechaHasta")} error={errors.fechaHasta?.message} />
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Generando..." : "Generar Reporte"}
        </Button>
      </div>
    </form>
  )
}

export { ReporteForm }
