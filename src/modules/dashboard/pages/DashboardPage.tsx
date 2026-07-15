import { Link } from "react-router-dom"
import {
  Sprout, Users, Wallet, Calendar, ClipboardList,
  ShoppingCart, CreditCard, Package, TrendingUp, Leaf,
  Bell, Plus, Sun, ArrowUpCircle, ArrowDownCircle,
} from "lucide-react"
import { StatsCard } from "../components/StatsCard"
import { ActivityList } from "../components/ActivityList"
import { SummaryChart } from "../components/SummaryChart"
import { StockAlert } from "../components/StockAlert"
import { useDashboard } from "../hooks/useDashboard"
import { dashboardService } from "../services/dashboard.service"
import { formatCompactCurrency } from "@/utils/formatCurrency"
import { formatRelativeDate } from "@/utils/formatDate"
import { Skeleton } from "@/components/ui/Skeleton"
import { Alert } from "@/components/ui/Alert"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { RefreshCw } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import type { DashboardResumen } from "../types/dashboard.types"

const POLL_INTERVAL = 60000

const quickActions = [
  { to: "/app/actividades/nueva", label: "Nueva Actividad", icon: ClipboardList, color: "emerald" },
  { to: "/app/ventas/nuevo", label: "Registrar Venta", icon: ShoppingCart, color: "emerald" },
  { to: "/app/gastos/nuevo", label: "Registrar Gasto", icon: CreditCard, color: "red" },
  { to: "/app/movimientos/nuevo?tipo=ENTRADA", label: "Entrada Inventario", icon: ArrowUpCircle, color: "sky" },
  { to: "/app/movimientos/nuevo?tipo=SALIDA", label: "Salida Inventario", icon: ArrowDownCircle, color: "amber" },
  { to: "/app/trabajadores/nuevo", label: "Nuevo Trabajador", icon: Users, color: "purple" },
  { to: "/app/lotes/nuevo", label: "Crear Lote", icon: Leaf, color: "amber" },
]

const actionColors: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  red: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
}

function DashboardPage() {
  const { user } = useAuth()
  const { data, loading, error, refetch } = useDashboard()
  const [resumen, setResumen] = useState<DashboardResumen | null>(null)
  const [resumenLoading, setResumenLoading] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchResumen = async () => {
    try {
      const r = await dashboardService.getResumen()
      setResumen(r)
    } catch {
      // non-critical
    }
  }

  useEffect(() => {
    setResumenLoading(true)
    fetchResumen().finally(() => setResumenLoading(false))
    intervalRef.current = setInterval(fetchResumen, POLL_INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const handleRefresh = async () => {
    await Promise.all([refetch(), fetchResumen()])
  }

  const isLoading = loading || resumenLoading

  return (
    <div className="space-y-6">
      {error && <Alert severity="error">{error}</Alert>}

      {/* Welcome + Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            ¡Bienvenido{user?.nombre ? `, ${user.nombre}` : ""}!
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Resumen general de tu finca familiar
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleRefresh} loading={isLoading}>
          <RefreshCw size={14} />
          Actualizar
        </Button>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3 flex items-center gap-2">
          <Plus size={16} className="text-emerald-600 dark:text-emerald-400" />
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="flex flex-col items-center gap-2 rounded-xl border border-stone-200 bg-white p-4 text-center hover:shadow-md hover:border-emerald-300 transition-all dark:border-stone-800 dark:bg-stone-900 dark:hover:border-emerald-700"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${actionColors[action.color]}`}>
                <action.icon size={20} />
              </div>
              <span className="text-xs font-medium text-stone-700 dark:text-stone-300 leading-tight">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* General Stats */}
      <div>
        <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3 flex items-center gap-2">
          <Sprout size={16} className="text-emerald-600 dark:text-emerald-400" />
          Resumen General
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="card" />)
          ) : (
            <>
              <StatsCard title="Fincas" value={resumen?.totalFincas ?? data?.stats.totalFincas ?? 0} icon={<Sprout size={22} />} color="emerald" />
              <StatsCard title="Cultivos Activos" value={resumen?.cultivosActivos ?? data?.stats.cultivosActivos ?? 0} icon={<Leaf size={22} />} color="sky" />
              <StatsCard title="Trabajadores" value={resumen?.trabajadoresActivos ?? data?.stats.totalTrabajadoresActivos ?? 0} icon={<Users size={22} />} color="purple" />
              <StatsCard title="Eventos Hoy" value={resumen?.eventosHoy ?? 0} icon={<Calendar size={22} />} color="amber" />
            </>
          )}
        </div>
      </div>

      {/* Today's Operations */}
      {!isLoading && (resumen || data) && (
        <div>
          <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3 flex items-center gap-2">
            <Sun size={16} className="text-amber-600 dark:text-amber-400" />
            Operaciones del Día
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatsCard title="Jornales Hoy" value={resumen?.jornalesDelDia ?? data?.stats.jornalesDelDia ?? 0} icon={<Sun size={22} />} color="amber" />
            <StatsCard title="Actividades Pendientes" value={resumen?.actividadesPendientes ?? 0} icon={<ClipboardList size={22} />} color="red" />
            <StatsCard title="Inventario Crítico" value={resumen?.inventarioCritico ?? data?.stats.totalProductos ?? 0} icon={<Package size={22} />} color="red" />
          </div>
        </div>
      )}

      {/* Financial Summary */}
      <div>
        <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3 flex items-center gap-2">
          <Wallet size={16} className="text-emerald-600 dark:text-emerald-400" />
          Finanzas del Mes
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="card" />)
          ) : (
            <>
              <StatsCard title="Ventas" value={formatCompactCurrency(resumen?.ventasDelMes ?? data?.stats.ingresosMes ?? 0)} icon={<TrendingUp size={22} />} color="emerald" />
              <StatsCard title="Gastos" value={formatCompactCurrency(resumen?.gastosDelMes ?? data?.stats.gastosMes ?? 0)} icon={<ShoppingCart size={22} />} color="red" />
              <StatsCard title="Utilidad" value={formatCompactCurrency(resumen?.utilidadEstimada ?? data?.stats.balance ?? 0)} icon={<Wallet size={22} />} color={(resumen?.utilidadEstimada ?? data?.stats.balance ?? 0) >= 0 ? "emerald" : "red"} />
            </>
          )}
        </div>
      </div>

      {/* Charts & Alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-4">Gastos por Categoría</h3>
            <SummaryChart
              gastosPorCategoria={data?.gastosPorCategoria ?? []}
              ingresosMes={data?.stats.ingresosMes ?? 0}
              gastosMes={data?.stats.gastosMes ?? 0}
              loading={loading}
            />
          </Card>

          <Card>
            <ActivityList
              activities={data?.actividadesRecientes ?? []}
              loading={loading}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <StockAlert
              productos={data?.stockBajo ?? []}
              loading={loading}
            />
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-4">Últimos Movimientos</h3>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex gap-3">
                    <div className="h-8 w-8 rounded-lg bg-stone-200 dark:bg-stone-700" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-24 rounded bg-stone-100 dark:bg-stone-800" />
                      <div className="h-2 w-16 rounded bg-stone-100 dark:bg-stone-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.ultimosMovimientos?.length ? (
              <div className="space-y-2">
                {data.ultimosMovimientos.map((mov) => (
                  <div key={mov.id} className="flex items-center gap-3 rounded-lg border border-stone-100 px-3 py-2 dark:border-stone-800">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      mov.tipo === "ENTRADA"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {mov.tipo === "ENTRADA"
                        ? <ShoppingCart size={14} />
                        : <CreditCard size={14} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-700 dark:text-stone-200 truncate">
                        {mov.producto?.nombre || "Movimiento"}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 dark:text-stone-400">{mov.cantidad} {mov.unidadMedida}</span>
                        <span className="text-xs text-stone-300 dark:text-stone-600">·</span>
                        <span className="text-xs text-stone-500 dark:text-stone-400">{formatRelativeDate(mov.fecha)}</span>
                      </div>
                    </div>
                    <Badge color={mov.tipo === "ENTRADA" ? "success" : "error"}>{mov.tipo}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <Package size={24} className="mx-auto text-stone-300 dark:text-stone-600" />
                <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">Sin movimientos recientes.</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Notifications Alert */}
      {resumen && resumen.notificacionesNoLeidas > 0 && (
        <Alert severity="info">
          <div className="flex items-center gap-2">
            <Bell size={16} />
            <span>Tienes <strong>{resumen.notificacionesNoLeidas}</strong> notificaciones sin leer.</span>
            <Link to="/app/notificaciones" className="ml-2 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400">
              Ver notificaciones
            </Link>
          </div>
        </Alert>
      )}
    </div>
  )
}

export default DashboardPage