import { useParams, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { Badge } from "@/components/ui/Badge"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { useCaja } from "../hooks/useCaja"
import type { MovimientoCaja } from "../types/caja.types"
import { formatDate } from "@/utils/formatDate"
import { formatCurrency } from "@/utils/formatCurrency"
import { ArrowLeft, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react"

const columns: Column<MovimientoCaja>[] = [
  { key: "fecha", header: "Fecha", render: (item) => formatDate(item.fecha) },
  { key: "concepto", header: "Concepto" },
  {
    key: "tipo",
    header: "Tipo",
    render: (item) => (
      <Badge color={item.tipo === "INGRESO" ? "success" : item.tipo === "EGRESO" ? "error" : "warning"}>{item.tipo}</Badge>
    ),
  },
  {
    key: "monto",
    header: "Monto",
    render: (item) => (
      <span className={`font-semibold ${item.tipo === "INGRESO" ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
        {item.tipo === "INGRESO" ? "+" : "-"}{formatCurrency(item.monto)}
      </span>
    ),
  },
]

function DetalleCajaPage() {
  const { id } = useParams<{ id: string }>()
  const { caja, movimientos, loading, movimientosLoading, error, saldo } = useCaja(id ? Number(id) : null)

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!caja) return <Alert severity="info">Caja no encontrada</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title={caja.nombre} description="Detalle de caja y movimientos" actions={
        <div className="flex gap-2">
          <Link to="/app/caja"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
          <Link to={`/app/caja/${id}/movimiento?tipo=INGRESO`}>
            <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20">
              <ArrowUpRight size={16} />Ingreso
            </Button>
          </Link>
          <Link to={`/app/caja/${id}/movimiento?tipo=EGRESO`}>
            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20">
              <ArrowDownRight size={16} />Egreso
            </Button>
          </Link>
        </div>
      } />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-stone-500 dark:text-stone-400">Saldo Actual</p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(saldo)}</p>
        </Card>
        <Card>
          <p className="text-sm text-stone-500 dark:text-stone-400">Total Movimientos</p>
          <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{movimientos.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-stone-500 dark:text-stone-400">Descripción</p>
          <p className="text-stone-700 dark:text-stone-200">{caja.descripcion || "Sin descripción"}</p>
        </Card>
      </div>
      <Card title="Movimientos" padding="none">
        <DataTable
          columns={columns}
          data={movimientos}
          loading={movimientosLoading}
          emptyMessage="No hay movimientos registrados."
          keyExtractor={(item) => item.id}
        />
      </Card>
    </div>
  )
}

export default DetalleCajaPage
