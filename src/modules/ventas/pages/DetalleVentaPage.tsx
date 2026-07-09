import { useParams, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { useVenta } from "../hooks/useVenta"
import { formatDate } from "@/utils/formatDate"
import { formatCurrency } from "@/utils/formatCurrency"
import { ArrowLeft } from "lucide-react"

function DetalleVentaPage() {
  const { id } = useParams<{ id: string }>()
  const { venta, loading, error } = useVenta(id ? Number(id) : null)

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!venta) return <Alert severity="info">Venta no encontrada</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title={`Venta #${venta.id}`} description={venta.cliente} actions={
        <Link to="/app/ventas"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Información de la Venta">
          <dl className="space-y-3">
            <div><dt className="text-sm text-stone-500">Fecha</dt><dd>{formatDate(venta.fecha)}</dd></div>
            <div><dt className="text-sm text-stone-500">Cliente</dt><dd>{venta.cliente}</dd></div>
            <div><dt className="text-sm text-stone-500">Producto</dt><dd>{venta.tipoProducto}</dd></div>
            <div><dt className="text-sm text-stone-500">Descripción</dt><dd>{venta.descripcion || "-"}</dd></div>
          </dl>
        </Card>
        <Card title="Detalle Económico">
          <dl className="space-y-3">
            <div><dt className="text-sm text-stone-500">Cantidad</dt><dd>{venta.cantidad} {venta.unidadMedida}</dd></div>
            <div><dt className="text-sm text-stone-500">Precio Unitario</dt><dd>{formatCurrency(venta.precioUnitario)}</dd></div>
            <div><dt className="text-sm text-stone-500">Total</dt><dd className="font-bold text-xl text-emerald-700">{formatCurrency(venta.total)}</dd></div>
          </dl>
        </Card>
      </div>
    </div>
  )
}

export default DetalleVentaPage
