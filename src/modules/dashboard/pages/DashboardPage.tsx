import { PageHeader, Breadcrumb } from "@/components/layout"
import {
  MapPin,
  Sprout,
  Package,
  DollarSign,
} from "lucide-react"
import { StatsCard } from "../components/StatsCard"
import { ActivityList } from "../components/ActivityList"
import { SummaryChart } from "../components/SummaryChart"
import { StockAlert } from "../components/StockAlert"
import { QuickLinks } from "../components/QuickLinks"
import { useDashboard } from "../hooks/useDashboard"
import { formatCompactCurrency } from "@/utils/formatCurrency"
import { Skeleton } from "@/components/ui/Skeleton"
import { Alert } from "@/components/ui/Alert"
import { Button } from "@/components/ui/Button"
import { RefreshCw } from "lucide-react"

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
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="card" />)
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
              title="Productos"
              value={data?.stats.totalProductos ?? 0}
              icon={<Package size={24} />}
              color="sky"
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

      {/* Third Row: Activity + QuickLinks */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityList
            activities={data?.actividadesRecientes ?? []}
            loading={loading}
          />
        </div>
        <div>
          <QuickLinks />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
