import { useParams } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { BackButton } from "@/components/shared/BackButton"
import { useJornal } from "../hooks/useJornal"
import { formatDate } from "@/utils/formatDate"
import { formatCurrency } from "@/utils/formatCurrency"

const tipoPagoBadge: Record<string, "success" | "info"> = {
  DIA: "success",
  KILO: "info",
}

const tipoPagoLabels: Record<string, string> = {
  DIA: "Por Día",
  KILO: "Por Kilo",
}

function DetalleJornalPage() {
  const { id } = useParams<{ id: string }>()
  const { jornal, loading, error } = useJornal(id ? Number(id) : null)

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!jornal) return <Alert severity="info">Jornal no encontrado</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title={`Jornal #${jornal.id}`} description={formatDate(jornal.fecha)} actions={<BackButton to="/app/jornales" />} />
      <Card title="Detalle del Jornal">
        <dl className="space-y-3">
          <div><dt className="text-sm text-stone-500 dark:text-stone-400">Fecha</dt><dd className="dark:text-stone-100">{formatDate(jornal.fecha)}</dd></div>
          <div><dt className="text-sm text-stone-500 dark:text-stone-400">Trabajador</dt><dd className="dark:text-stone-100">{jornal.trabajador?.nombre || "-"}</dd></div>
          <div><dt className="text-sm text-stone-500 dark:text-stone-400">Tipo de Pago</dt><dd><Badge color={tipoPagoBadge[jornal.tipoPago] || "default"}>{tipoPagoLabels[jornal.tipoPago] || jornal.tipoPago}</Badge></dd></div>
          {jornal.tipoPago === "DIA" && (
            <>
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Valor del Jornal (día)</dt><dd className="dark:text-stone-100">{formatCurrency(jornal.valorDia ?? 0)}</dd></div>
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Cantidad de Días</dt><dd className="dark:text-stone-100">{jornal.cantidadDias ?? 1}</dd></div>
            </>
          )}
          {jornal.tipoPago === "KILO" && (
            <>
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Cantidad Recolectada</dt><dd className="dark:text-stone-100">{jornal.cantidadKg ?? 0} kg</dd></div>
              <div><dt className="text-sm text-stone-500 dark:text-stone-400">Valor por Kilo</dt><dd className="dark:text-stone-100">{formatCurrency(jornal.valorKilo ?? 0)}</dd></div>
            </>
          )}
          <div><dt className="text-sm text-stone-500 dark:text-stone-400">Total</dt><dd className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(jornal.total)}</dd></div>
          <div><dt className="text-sm text-stone-500 dark:text-stone-400">Lote</dt><dd className="dark:text-stone-100">{jornal.lote?.nombre || "-"}</dd></div>
          <div><dt className="text-sm text-stone-500 dark:text-stone-400">Descripción</dt><dd className="dark:text-stone-100">{jornal.descripcion || "-"}</dd></div>
        </dl>
      </Card>
    </div>
  )
}

export default DetalleJornalPage