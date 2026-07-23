import { useParams, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Form, FormInput, FormActions } from "@/components/form"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCategoria } from "../hooks/useCategoria"
import { updateCategoriaSchema, type UpdateCategoriaFormData } from "../schemas/categoria.schema"
import { categoriaService } from "../services/categoria.service"
import { useNotification } from "@/hooks/useNotification"
import { BackButton } from "@/components/shared/BackButton"
import { Edit, Save, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"

function DetalleCategoriaPage() {
  const { id } = useParams<{ id: string }>()
  const { categoria, loading, error } = useCategoria(id ? Number(id) : null)
  const { notify } = useNotification()
  const [editing, setEditing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UpdateCategoriaFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(updateCategoriaSchema) as any,
  })

  useEffect(() => {
    if (categoria) {
      reset({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        activo: categoria.activo,
      })
    }
  }, [categoria, reset])

  const onSubmit = async (data: UpdateCategoriaFormData) => {
    if (!id) return
    setSubmitError(null)
    try {
      await categoriaService.update(Number(id), data)
      notify({ type: "success", title: "Categoría actualizada", message: "Cambios guardados correctamente." })
      setEditing(false)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al actualizar categoría")
    }
  }

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!categoria) return <Alert severity="info">Categoría no encontrada</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title={categoria.nombre}
        description={categoria.descripcion || "Sin descripción"}
        actions={
          <div className="flex gap-2">
            <BackButton to="/app/categorias" />
            {editing ? (
              <Link to={`/app/categorias/${id}`}>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  <ArrowLeft size={16} />
                  Cancelar
                </Button>
              </Link>
            ) : (
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit size={16} />
                Editar
              </Button>
            )}
          </div>
        }
      />
      {submitError && <Alert severity="error">{submitError}</Alert>}
      {editing ? (
        <Card>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormInput label="Nombre" {...register("nombre")} error={errors.nombre?.message} />
            <FormInput label="Descripción" {...register("descripcion")} error={errors.descripcion?.message} />
            <FormActions>
              <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}><Save size={16} />{isSubmitting ? "Guardando..." : "Guardar"}</Button>
            </FormActions>
          </Form>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Información General">
            <dl className="space-y-3">
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Nombre</dt><dd className="dark:text-stone-100">{categoria.nombre}</dd></div>
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Descripción</dt><dd>{categoria.descripcion || "-"}</dd></div>
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Estado</dt><dd><Badge color={categoria.activo ? "success" : "default"}>{categoria.activo ? "Activo" : "Inactivo"}</Badge></dd></div>
            </dl>
          </Card>
        </div>
      )}
    </div>
  )
}

export default DetalleCategoriaPage
