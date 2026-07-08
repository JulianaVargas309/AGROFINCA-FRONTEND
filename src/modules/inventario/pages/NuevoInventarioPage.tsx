import { useNavigate } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { InventarioForm } from "../components/InventarioForm"
import { inventarioService } from "../services/inventario.service"
import { ROUTES } from "@/constants/routes"
import { useNotification } from "@/hooks/useNotification"
import { useState } from "react"
import type { CreateProductoFormData, UpdateProductoFormData } from "../schemas/inventario.schema"

function NuevoInventarioPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: CreateProductoFormData | UpdateProductoFormData) => {
    setError(null)
    setLoading(true)
    try {
      await inventarioService.create(data as CreateProductoFormData)
      notify({ type: "success", title: "Producto creado", message: `"${(data as CreateProductoFormData).nombre}" registrado.` })
      navigate(ROUTES.INVENTARIO)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear producto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Nuevo Producto" description="Registra un nuevo producto en el inventario" />
      <Card className="max-w-lg">
        <InventarioForm mode="create" onSubmit={handleSubmit} loading={loading} error={error} onClearError={() => setError(null)} submitLabel="Crear Producto" />
      </Card>
    </div>
  )
}

export default NuevoInventarioPage
