import { formatCurrency, formatCompactCurrency } from "@/utils/formatCurrency"
import type { GastosResumen } from "../types/dashboard.types"
import { cn } from "@/utils/cn"
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"

interface SummaryChartProps {
  gastosPorCategoria: GastosResumen[]
  ingresosMes: number
  gastosMes: number
  loading?: boolean
}

const CATEGORIA_COLORS: Record<string, string> = {
  INSUMOS: "bg-amber-500",
  MANO_DE_OBRA: "bg-sky-500",
  MANTENIMIENTO: "bg-purple-500",
  TRANSPORTE: "bg-emerald-500",
  ADMINISTRACION: "bg-stone-500",
  OTRO: "bg-stone-400",
}

const CATEGORIA_LABELS: Record<string, string> = {
  INSUMOS: "Insumos",
  MANO_DE_OBRA: "Mano de obra",
  MANTENIMIENTO: "Mantenimiento",
  TRANSPORTE: "Transporte",
  ADMINISTRACION: "Administración",
  OTRO: "Otros",
}

export function SummaryChart({ gastosPorCategoria, ingresosMes, gastosMes, loading }: SummaryChartProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 rounded bg-stone-200 dark:bg-stone-700" />
        <div className="h-3 w-full rounded bg-stone-100 dark:bg-stone-800" />
        <div className="h-3 w-full rounded bg-stone-100 dark:bg-stone-800" />
        <div className="h-3 w-5/6 rounded bg-stone-100 dark:bg-stone-800" />
      </div>
    )
  }

  const totalGastos = gastosPorCategoria.reduce((sum, g) => sum + g.total, 0)

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 mb-1">
            <TrendingUp size={14} />
            <span className="text-xs font-medium">Ingresos</span>
          </div>
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{formatCompactCurrency(ingresosMes)}</p>
        </div>
        <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 mb-1">
            <TrendingDown size={14} />
            <span className="text-xs font-medium">Gastos</span>
          </div>
          <p className="text-lg font-bold text-red-700 dark:text-red-300">{formatCompactCurrency(gastosMes)}</p>
        </div>
      </div>

      {totalGastos > 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-stone-500 dark:text-stone-400">Distribución de gastos</p>
          <div className="flex h-3 rounded-full overflow-hidden bg-stone-100 dark:bg-stone-800">
            {gastosPorCategoria.map((g) => {
              const pct = (g.total / totalGastos) * 100
              return (
                <div
                  key={g.categoria}
                  className={cn("h-full transition-all", CATEGORIA_COLORS[g.categoria] || "bg-stone-400")}
                  style={{ width: `${Math.max(pct, 2)}%` }}
                  title={`${CATEGORIA_LABELS[g.categoria] || g.categoria}: ${formatCurrency(g.total)}`}
                />
              )
            })}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {gastosPorCategoria.map((g) => (
              <div key={g.categoria} className="flex items-center gap-1.5">
                <span className={cn("block h-2.5 w-2.5 rounded-sm", CATEGORIA_COLORS[g.categoria] || "bg-stone-400")} />
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  {CATEGORIA_LABELS[g.categoria] || g.categoria}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-6 text-center">
          <DollarSign size={28} className="mx-auto text-stone-300 dark:text-stone-600" />
          <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">Sin datos financieros este mes.</p>
        </div>
      )}
    </div>
  )
}