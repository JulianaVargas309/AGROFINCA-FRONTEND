import { Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Alert } from "@/components/ui/Alert"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { DataTable } from "@/components/shared/DataTable"
import type { Column } from "@/components/shared/DataTable"
import { Badge } from "@/components/ui/Badge"
import { useFlujos } from "../hooks/useFlujos"
import type { FlujoEfectivo } from "../types/flujo.types"
import { formatDate } from "@/utils/formatDate"
import { formatCurrency } from "@/utils/formatCurrency"
import { Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import type { Option } from "@/types"

const tipoOptions: Option[] = [
  { value: "", label: "Todos" },
  { value: "INGRESO", label: "Ingresos" },
  { value: "EGRESO", label: "Egresos" },
]

const columns: Column<FlujoEfectivo>[] = [
  { key: "fecha", header: "Fecha", render: (item) => item.fecha ? formatDate(item.fecha) : "-" },
  { key: "tipo", header: "Tipo", render: (item) => <Badge color={item.tipo === "INGRESO" ? "success" : "error"}>{item.tipo}</Badge> },
  { key: "categoria", header: "Categoría", render: (item) => item.categoria || "-" },
  { key: "descripcion", header: "Descripción", render: (item) => item.descripcion || "-" },
  {
    key: "monto",
    header: "Monto",
    render: (item) => (
      <span className={`font-semibold ${item.tipo === "INGRESO" ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
        {item.tipo === "INGRESO" ? "+" : "-"}{formatCurrency(item.monto)}
      </span>
    ),
  },
]

function FlujoPage() {
  const { flujos, resumen, loading, error, fechaDesde, fechaHasta, tipoFiltro, setFechaDesde, setFechaHasta, setTipoFiltro } = useFlujos()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Flujo de Efectivo" description="Control de ingresos y egresos" actions={
        <Link to="/app/flujo/nuevo"><Button><Plus size={16} />Nuevo Registro</Button></Link>
      } />
      {error && <Alert severity="error">{error}</Alert>}

      {/* Resumen Cards */}
      {resumen && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-400">Ingresos</p>
                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(resumen.ingresos)}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <TrendingDown size={20} />
              </div>
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-400">Egresos</p>
                <p className="text-xl font-bold text-red-700 dark:text-red-300">{formatCurrency(resumen.egresos)}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-50 text-stone-600 dark:bg-stone-800 dark:text-stone-400">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-400">Balance</p>
                <p className={`text-xl font-bold ${resumen.balance >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
                  {formatCurrency(resumen.balance)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Categorias summary */}
      {resumen && (resumen.porCategoria?.length ?? 0) > 0 && (
        <Card title="Distribución por Categoría">
          <div className="space-y-3">
            {(resumen.porCategoria ?? []).map((cat) => {
              const total = resumen.ingresos + resumen.egresos
              const pct = total > 0 ? Math.round((cat.total / total) * 100) : 0
              return (
                <div key={cat.categoria} className="flex items-center gap-3">
                  <span className="text-sm text-stone-600 dark:text-stone-300 w-32 truncate">{cat.categoria}</span>
                  <div className="flex-1 h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-200 w-24 text-right">{formatCurrency(cat.total)}</span>
                  <span className="text-xs text-stone-400 dark:text-stone-500 w-12 text-right">{pct}%</span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-44">
          <Input label="Fecha Desde" type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
        </div>
        <div className="w-44">
          <Input label="Fecha Hasta" type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
        </div>
        <div className="w-44">
          <Select label="Tipo" options={tipoOptions} value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <Card padding="none">
        <DataTable
          columns={columns}
          data={flujos}
          loading={loading}
          emptyMessage="No hay registros de flujo en el período seleccionado."
          keyExtractor={(item) => item.id}
        />
      </Card>
    </div>
  )
}

export default FlujoPage
