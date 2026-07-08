import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { createMovimientoSchema, type CreateMovimientoFormData } from "../schemas/inventario.schema"
import { TIPO_MOVIMIENTO_OPTIONS } from "@/constants/inventario"
import { ArrowDown } from "lucide-react"

interface MovimientoFormProps {
  productoId: number
  onSubmit: (data: CreateMovimientoFormData) => Promise<void>
  loading?: boolean
}

function MovimientoForm({ productoId, onSubmit, loading }: MovimientoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateMovimientoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createMovimientoSchema) as any,
    defaultValues: { cantidad: undefined, motivo: "", tipo: "entrada", productoId },
  })

  const submit = async (data: CreateMovimientoFormData) => {
    await onSubmit(data)
    reset({ cantidad: undefined, motivo: "", tipo: "entrada", productoId })
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex items-end gap-3 flex-wrap">
      <input type="hidden" {...register("productoId")} />
      <Select options={TIPO_MOVIMIENTO_OPTIONS} className="w-[130px]" error={errors.tipo?.message} {...register("tipo")} />
      <Input type="number" placeholder="Cantidad" className="w-[120px]" error={errors.cantidad?.message} {...register("cantidad")} />
      <Input placeholder="Motivo (opcional)" className="flex-1 min-w-[180px]" {...register("motivo")} />
      <Button type="submit" loading={loading}>
        <ArrowDown size={14} />
        Registrar
      </Button>
    </form>
  )
}

export { MovimientoForm }
export type { MovimientoFormProps }
