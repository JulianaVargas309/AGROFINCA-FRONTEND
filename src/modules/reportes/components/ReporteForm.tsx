import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/Button"
import { Form, FormInput, FormSelect, FormActions } from "@/components/form"
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
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormSelect
        label="Tipo de Reporte"
        options={reportTypeOptions}
        placeholder="Seleccione..."
        {...register("tipo")}
        error={errors.tipo?.message}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput label="Fecha Desde" type="date" {...register("fechaDesde")} error={errors.fechaDesde?.message} />
        <FormInput label="Fecha Hasta" type="date" {...register("fechaHasta")} error={errors.fechaHasta?.message} />
      </div>
      <FormActions>
        <Button type="submit" disabled={loading}>
          {loading ? "Generando..." : "Generar Reporte"}
        </Button>
      </FormActions>
    </Form>
  )
}

export { ReporteForm }
