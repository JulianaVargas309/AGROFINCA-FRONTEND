import { useNavigate, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Form, FormInput, FormActions } from "@/components/form"
import { Alert } from "@/components/ui/Alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createCategoriaSchema, type CreateCategoriaFormData } from "../schemas/categoria.schema"
import { categoriaService } from "../services/categoria.service"
import { useNotification } from "@/hooks/useNotification"
import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"

function NuevaCategoriaPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateCategoriaFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createCategoriaSchema) as any,
  })

  const onSubmit = async (data: CreateCategoriaFormData) => {
    setError(null)
    try {
      await categoriaService.create(data)
      notify({ type: "success", title: "Categoría creada", message: "Categoría registrada correctamente." })
      navigate("/app/categorias")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear categoría")
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Nueva Categoría"
        description="Registra una nueva categoría de producto"
        actions={
          <Link to="/app/categorias">
            <Button variant="outline">
              <ArrowLeft size={16} />
              Volver
            </Button>
          </Link>
        }
      />
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Nombre" {...register("nombre")} error={errors.nombre?.message} />
          <FormInput label="Descripción" {...register("descripcion")} error={errors.descripcion?.message} />
          <FormActions>
            <Link to="/app/categorias"><Button type="button" variant="outline">Cancelar</Button></Link>
            <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
          </FormActions>
        </Form>
      </Card>
    </div>
  )
}

export default NuevaCategoriaPage
