import { useParams, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { useMovimiento } from "../hooks/useMovimiento"
import { formatDate } from "@/utils/formatDate"
import { ArrowLeft } from "lucide-react"

function DetalleMovimientoPage() {
  const { id } = useParams<{ id: string }>()
  const { movimiento, loading, error } = useMovimiento(id ? Number(id) : null)

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!movimiento) return <Alert severity="info">Movimiento no encontrado</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title={`Movimiento #${movimiento.id}`} description={`${movimiento.tipo} - ${movimiento.producto?.nombre || ""}`} actions={
        <Link to="/app/movimientos"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      <Card title="Detalle del Movimiento">
        <dl className="space-y-3">
          <div><dt className="text-sm text-stone-500">Tipo</dt><dd><Badge color={movimiento.tipo === "ENTRADA" ? "success" : "error"}>{movimiento.tipo}</Badge></dd></div>
          <div><dt className="text-sm text-stone-500">Producto</dt><dd>{movimiento.producto?.nombre || "-"}</dd></div>
          <div><dt className="text-sm text-stone-500">Cantidad</dt><dd>{movimiento.cantidad} {movimiento.unidadMedida}</dd></div>
          <div><dt className="text-sm text-stone-500">Fecha</dt><dd>{formatDate(movimiento.fecha)}</dd></div>
          <div><dt className="text-sm text-stone-500">Lote</dt><dd>{movimiento.lote?.nombre || "-"}</dd></div>
          <div><dt className="text-sm text-stone-500">Descripción</dt><dd>{movimiento.descripcion || "-"}</dd></div>
        </dl>
      </Card>
    </div>
  )
}

export default DetalleMovimientoPage
