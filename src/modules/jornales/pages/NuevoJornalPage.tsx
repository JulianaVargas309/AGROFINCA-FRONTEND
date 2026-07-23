import { useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Form, FormInput, FormSelect, FormTextarea, FormActions } from "@/components/form"
import { Alert } from "@/components/ui/Alert"
import { BackButton } from "@/components/shared/BackButton"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createJornalSchema, type CreateJornalFormData } from "../schemas/jornal.schema"
import { jornalService } from "../services/jornal.service"
import { trabajadorService } from "@/modules/trabajadores/services/trabajador.service"
import { loteService } from "@/modules/lotes/services/lote.service"
import { fincaService } from "@/modules/fincas/services/finca.service"
import { useNotification } from "@/hooks/useNotification"
import { useState, useEffect, useMemo } from "react"
import { Save } from "lucide-react"

interface TrabajadorOption { id: number; nombre: string }
interface LoteOption { id: number; nombre: string }

const tipoPagoOptions = [
  { value: "DIA", label: "Por Día" },
  { value: "KILO", label: "Por Kilo / Destajo" },
]

function NuevoJornalPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const [trabajadores, setTrabajadores] = useState<TrabajadorOption[]>([])
  const [lotes, setLotes] = useState<LoteOption[]>([])

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CreateJornalFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createJornalSchema) as any,
  })

  const tipoPago = watch("tipoPago")
  const cantidadKg = watch("cantidadKg")
  const valorKilo = watch("valorKilo")
  const valorDia = watch("valorDia")
  const cantidadDias = watch("cantidadDias")

  const totalCalculado = useMemo(() => {
    if (tipoPago === "KILO") {
      const kg = Number(cantidadKg) || 0
      const vk = Number(valorKilo) || 0
      return kg * vk
    }
    if (tipoPago === "DIA") {
      const vd = Number(valorDia) || 0
      const cd = Number(cantidadDias) || 1
      return vd * cd
    }
    return 0
  }, [tipoPago, cantidadKg, valorKilo, valorDia, cantidadDias])

  useEffect(() => {
    trabajadorService.findAll().then((res) => {
      const list = Array.isArray(res) ? res : (res as { data: TrabajadorOption[] }).data
      setTrabajadores(list ?? [])
    }).catch(() => {})
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
      await jornalService.create({ ...data, total: totalCalculado })
      notify({ type: "success", title: "Jornal creado", message: "Jornal registrado correctamente." })
      navigate("/app/jornales")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear jornal")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Nuevo Jornal" description="Registra un jornal" actions={<BackButton to="/app/jornales" />} />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Fecha" type="date" {...register("fecha")} error={errors.fecha?.message} />
            <FormSelect label="Tipo de Pago" options={tipoPagoOptions} placeholder="Seleccione..." {...register("tipoPago")} error={errors.tipoPago?.message} />
          </div>
          <FormSelect label="Trabajador" options={trabajadores.map((t) => ({ value: String(t.id), label: t.nombre }))} placeholder="Seleccione un trabajador..." {...register("trabajadorId")} error={errors.trabajadorId?.message} />
          {tipoPago === "DIA" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Valor del Jornal (día)" type="number" step="0.01" {...register("valorDia")} error={errors.valorDia?.message} />
              <FormInput label="Cantidad de Días" type="number" min="1" defaultValue="1" {...register("cantidadDias")} error={errors.cantidadDias?.message} />
            </div>
          )}
          {tipoPago === "KILO" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Cantidad Recolectada (kg)" type="number" step="0.01" {...register("cantidadKg")} error={errors.cantidadKg?.message} />
              <FormInput label="Valor por Kilo" type="number" step="0.01" {...register("valorKilo")} error={errors.valorKilo?.message} />
            </div>
          )}
          <FormInput label="Total a Pagar" type="text" value={totalCalculado > 0 ? `$ ${totalCalculado.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$ 0"} disabled />
          <FormSelect label="Lote (opcional)" options={lotes.map((l) => ({ value: String(l.id), label: l.nombre }))} placeholder="Sin lote" {...register("loteId")} error={errors.loteId?.message} />
          <FormTextarea label="Descripción" {...register("descripcion")} error={errors.descripcion?.message} />
          <FormActions>
            <Button type="button" variant="outline" onClick={() => navigate("/app/jornales")}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </FormActions>
        </Form>
      </Card>
    </div>
  )
}

export default NuevoJornalPage