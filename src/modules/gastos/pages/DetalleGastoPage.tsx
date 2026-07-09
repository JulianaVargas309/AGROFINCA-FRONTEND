import { useParams, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { useGasto } from "../hooks/useGasto"
import { formatDate } from "@/utils/formatDate"
import { formatCurrency } from "@/utils/formatCurrency"
import { ArrowLeft } from "lucide-react"

function DetalleGastoPage() {
  const { id } = useParams<{ id: string }>()
  const { gasto, loading, error } = useGasto(id ? Number(id) : null)

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!gasto) return <Alert severity="info">Gasto no encontrado</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title={`Gasto #${gasto.id}`} description={gasto.categoria} actions={
        <Link to="/app/gastos"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      <Card title="Detalle del Gasto">
        <dl className="space-y-3">
          <div><dt className="text-sm text-stone-500">Fecha</dt><dd>{formatDate(gasto.fecha)}</dd></div>
          <div><dt className="text-sm text-stone-500">Categoría</dt><dd><Badge color="default">{gasto.categoria}</Badge></dd></div>
          <div><dt className="text-sm text-stone-500">Descripción</dt><dd>{gasto.descripcion}</dd></div>
          <div><dt className="text-sm text-stone-500">Monto</dt><dd className="font-bold text-lg text-red-600">{formatCurrency(gasto.monto)}</dd></div>
          <div><dt className="text-sm text-stone-500">Proveedor</dt><dd>{gasto.proveedor || "-"}</dd></div>
          <div><dt className="text-sm text-stone-500">Comprobante</dt><dd>{gasto.comprobante || "-"}</dd></div>
          <div><dt className="text-sm text-stone-500">Lote</dt><dd>{gasto.lote?.nombre || "-"}</dd></div>
        </dl>
      </Card>
    </div>
  )
}

export default DetalleGastoPage
