import { useParams, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { useJornal } from "../hooks/useJornal"
import { formatDate } from "@/utils/formatDate"
import { formatCurrency } from "@/utils/formatCurrency"
import { ArrowLeft } from "lucide-react"

function DetalleJornalPage() {
  const { id } = useParams<{ id: string }>()
  const { jornal, loading, error } = useJornal(id ? Number(id) : null)

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!jornal) return <Alert severity="info">Jornal no encontrado</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title={`Jornal #${jornal.id}`} description={formatDate(jornal.fecha)} actions={
        <Link to="/app/jornales"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      <Card title="Detalle del Jornal">
        <dl className="space-y-3">
          <div><dt className="text-sm text-stone-500 dark:text-stone-400">Fecha</dt><dd className="dark:text-stone-100">{formatDate(jornal.fecha)}</dd></div>
          <div><dt className="text-sm text-stone-500 dark:text-stone-400">Trabajador</dt><dd className="dark:text-stone-100">{jornal.trabajador?.nombre || "-"}</dd></div>
          <div><dt className="text-sm text-stone-500 dark:text-stone-400">Horas</dt><dd className="dark:text-stone-100">{jornal.horas}</dd></div>
          <div><dt className="text-sm text-stone-500 dark:text-stone-400">Valor por Hora</dt><dd className="dark:text-stone-100">{formatCurrency(jornal.valorHora)}</dd></div>
          <div><dt className="text-sm text-stone-500 dark:text-stone-400">Total</dt><dd className="dark:text-stone-100">{formatCurrency(jornal.total)}</dd></div>
          <div><dt className="text-sm text-stone-500 dark:text-stone-400">Lote</dt><dd className="dark:text-stone-100">{jornal.lote?.nombre || "-"}</dd></div>
          <div><dt className="text-sm text-stone-500 dark:text-stone-400">Descripción</dt><dd className="dark:text-stone-100">{jornal.descripcion || "-"}</dd></div>
        </dl>
      </Card>
    </div>
  )
}

export default DetalleJornalPage
