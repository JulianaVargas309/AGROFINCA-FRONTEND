import { PageHeader, Breadcrumb } from "@/components/layout"
import {
  MapPin,
  Sprout,
  DollarSign,
  Tractor,
  Wheat,
  Ruler,
  TrendingUp,
  ArrowLeftRight,
} from "lucide-react"
import { StatsCard } from "../components/StatsCard"
import { ActivityList } from "../components/ActivityList"
import { SummaryChart } from "../components/SummaryChart"
import { StockAlert } from "../components/StockAlert"
import { QuickLinks } from "../components/QuickLinks"
import { useDashboard } from "../hooks/useDashboard"
import { formatCompactCurrency } from "@/utils/formatCurrency"
import { formatRelativeDate } from "@/utils/formatDate"
import { Skeleton } from "@/components/ui/Skeleton"
import { Alert } from "@/components/ui/Alert"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { RefreshCw, ShoppingCart, CreditCard } from "lucide-react"

function DashboardPage() {
  const { data, loading, error, refetch } = useDashboard()

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title="Dashboard"
        description="Resumen general de tu finca familiar"
        actions={
          <Button variant="outline" size="sm" onClick={refetch} loading={loading}>
            <RefreshCw size={14} />
            Actualizar
          </Button>
        }
      />

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} variant="card" />)
        ) : (
          <>
            <StatsCard
              title="Fincas"
              value={data?.stats.totalFincas ?? 0}
              icon={<MapPin size={24} />}
              color="emerald"
            />
            <StatsCard
              title="Lotes"
              value={data?.stats.totalLotes ?? 0}
              icon={<Sprout size={24} />}
              color="amber"
            />
            <StatsCard
              title="Área Sembrada"
              value={`${data?.stats.totalAreaSembrada ?? 0} ha`}
              icon={<Ruler size={24} />}
              color="purple"
            />
            <StatsCard
              title="Cultivos Activos"
              value={data?.stats.cultivosActivos ?? 0}
              icon={<Tractor size={24} />}
              color="sky"
            />
            <StatsCard
              title="Producción Café"
              value={`${data?.stats.produccionCafe ?? 0} ha`}
              icon={<Wheat size={24} />}
              color="emerald"
            />
            <StatsCard
              title="Producción Caña"
              value={`${data?.stats.produccionCania ?? 0} ha`}
              icon={<Wheat size={24} />}
              color="amber"
            />
            <StatsCard
              title="Balance del Mes"
              value={formatCompactCurrency(data?.stats.balance ?? 0)}
              icon={<DollarSign size={24} />}
              color={data && data.stats.balance >= 0 ? "emerald" : "red"}
              trend={
                data && data.stats.ingresosMes > 0
                  ? Math.round((data.stats.balance / data.stats.ingresosMes) * 100)
                  : undefined
              }
              trendLabel="margen"
            />
            <StatsCard
              title="ROI Anual"
              value={`${data?.stats.roi ?? 0}%`}
              icon={<TrendingUp size={24} />}
              color={data && data.stats.roi >= 0 ? "emerald" : "red"}
            />
          </>
        )}
      </div>

      {/* Second Row: Incomes/Expenses + Chart */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SummaryChart
            gastosPorCategoria={data?.gastosPorCategoria ?? []}
            ingresosMes={data?.stats.ingresosMes ?? 0}
            gastosMes={data?.stats.gastosMes ?? 0}
            loading={loading}
          />
        </div>
        <div>
          <StockAlert
            productos={data?.stockBajo ?? []}
            loading={loading}
          />
        </div>
      </div>

      {/* Third Row: Activity + Recent Movements */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityList
            activities={data?.actividadesRecientes ?? []}
            loading={loading}
          />
        </div>
        <div>
          <Card>
            <h3 className="text-sm font-semibold text-stone-700 mb-3">Últimos Movimientos</h3>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex gap-3">
                    <div className="h-8 w-8 rounded-lg bg-stone-200" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-24 rounded bg-stone-100" />
                      <div className="h-2 w-16 rounded bg-stone-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.ultimosMovimientos?.length ? (
              <div className="space-y-2">
                {data.ultimosMovimientos.map((mov) => (
                  <div key={mov.id} className="flex items-center gap-3 rounded-lg border border-stone-100 px-3 py-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      mov.tipo === "ENTRADA" ? "bg-emerald-50" : "bg-red-50"
                    }`}>
                      {mov.tipo === "ENTRADA"
                        ? <ShoppingCart size={14} className="text-emerald-600" />
                        : <CreditCard size={14} className="text-red-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-700 truncate">
                        {mov.producto?.nombre || "Movimiento"}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500">{mov.cantidad} {mov.unidadMedida}</span>
                        <span className="text-xs text-stone-300">·</span>
                        <span className="text-xs text-stone-500">{formatRelativeDate(mov.fecha)}</span>
                      </div>
                    </div>
                    <Badge color={mov.tipo === "ENTRADA" ? "success" : "error"}>{mov.tipo}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <ArrowLeftRight size={24} className="mx-auto text-stone-300" />
                <p className="mt-2 text-xs text-stone-500">Sin movimientos recientes.</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Fourth Row: QuickLinks */}
      <QuickLinks />
    </div>
  )
}

export default DashboardPage
