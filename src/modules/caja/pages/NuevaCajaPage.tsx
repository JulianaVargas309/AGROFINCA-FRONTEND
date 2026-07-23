import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Form, FormInput, FormTextarea, FormActions } from "@/components/form"
import { Alert } from "@/components/ui/Alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createCajaSchema, type CreateCajaFormData } from "../schemas/caja.schema"
import { cajaService } from "../services/caja.service"
import { useNotification } from "@/hooks/useNotification"
import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"

function NuevaCajaPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateCajaFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createCajaSchema) as any,
  })

  const onSubmit = async (data: CreateCajaFormData) => {
    setError(null)
    try {
      await cajaService.createCaja(data)
      notify({ type: "success", title: "Caja creada", message: "Caja creada correctamente." })
      navigate("/app/caja")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la caja")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Nueva Caja" description="Registra una nueva caja" actions={
        <Link to="/app/caja"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Nombre" {...register("nombre")} error={errors.nombre?.message} />
          <FormTextarea label="Descripción" {...register("descripcion")} error={errors.descripcion?.message} />
          <FormActions>
            <Link to="/app/caja"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </FormActions>
        </Form>
      </Card>
    </div>
  )
}

export default NuevaCajaPage
