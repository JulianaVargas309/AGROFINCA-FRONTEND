import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Alert } from "@/components/ui/Alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createJornalSchema, type CreateJornalFormData } from "../schemas/jornal.schema"
import { jornalService } from "../services/jornal.service"
import { fincaService } from "@/modules/fincas/services/finca.service"
import { loteService } from "@/modules/lotes/services/lote.service"
import { useNotification } from "@/hooks/useNotification"
import { useState, useEffect } from "react"
import { ArrowLeft, Save } from "lucide-react"

interface LoteOption { id: number; nombre: string }

function NuevoJornalPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const [lotes, setLotes] = useState<LoteOption[]>([])
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateJornalFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createJornalSchema) as any,
  })

  useEffect(() => {
    fincaService.findAll().then(async (res) => {
      const fincas = Array.isArray(res) ? res : (res as { data: LoteOption[] }).data
      if (!fincas || fincas.length === 0) return
      const results = await Promise.all(
        (fincas as Array<{ id: number }>).map((f: { id: number }) =>
          loteService.findAll(f.id).catch(() => [] as LoteOption[])
        )
      )
      const all = results.flat().filter(Boolean) as LoteOption[]
      setLotes(all)
    }).catch(() => {})
  }, [])

  const onSubmit = async (data: CreateJornalFormData) => {
    setError(null)
    try {
      await jornalService.create(data)
      notify({ type: "success", title: "Jornal creado", message: "Jornal registrado correctamente." })
      navigate("/app/jornales")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear jornal")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Nuevo Jornal" description="Registra un jornal" actions={
        <Link to="/app/jornales"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Fecha" type="date" {...register("fecha")} error={errors.fecha?.message} />
          <Input label="Horas Trabajadas" type="number" {...register("horas")} error={errors.horas?.message} />
          <Input label="Valor por Hora" type="number" {...register("valorHora")} error={errors.valorHora?.message} />
          <Input label="ID Trabajador" type="number" {...register("trabajadorId")} error={errors.trabajadorId?.message} />
          <Select label="Lote (opcional)" options={lotes.map((l) => ({ value: String(l.id), label: l.nombre }))} placeholder="Sin lote" {...register("loteId")} error={errors.loteId?.message} />
          <Textarea label="Descripción" {...register("descripcion")} error={errors.descripcion?.message} />
          <div className="flex justify-end gap-3 pt-4">
            <Link to="/app/jornales"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default NuevoJornalPage
