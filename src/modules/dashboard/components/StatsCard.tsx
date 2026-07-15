import { cn } from "@/utils/cn"
import type { ReactNode } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: number
  trendLabel?: string
  color?: "default" | "emerald" | "amber" | "sky" | "red" | "purple"
}

const accentMap: Record<string, { bar: string; icon: string; iconBg: string; trendUp: string; trendDown: string }> = {
  default: {
    bar: "bg-stone-400",
    icon: "text-stone-600",
    iconBg: "bg-stone-100 dark:bg-stone-800",
    trendUp: "text-stone-600",
    trendDown: "text-stone-600",
  },
  emerald: {
    bar: "bg-emerald-500",
    icon: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
    trendUp: "text-emerald-600",
    trendDown: "text-red-600",
  },
  amber: {
    bar: "bg-amber-500",
    icon: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-900/30",
    trendUp: "text-amber-600",
    trendDown: "text-red-600",
  },
  sky: {
    bar: "bg-sky-500",
    icon: "text-sky-600 dark:text-sky-400",
    iconBg: "bg-sky-50 dark:bg-sky-900/30",
    trendUp: "text-sky-600",
    trendDown: "text-red-600",
  },
  red: {
    bar: "bg-red-500",
    icon: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-50 dark:bg-red-900/30",
    trendUp: "text-emerald-600",
    trendDown: "text-red-600",
  },
  purple: {
    bar: "bg-purple-500",
    icon: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-50 dark:bg-purple-900/30",
    trendUp: "text-purple-600",
    trendDown: "text-red-600",
  },
}

export function StatsCard({ title, value, icon, trend, trendLabel, color = "default" }: StatsCardProps) {
  const colors = accentMap[color]

  return (
    <div className="relative overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 dark:border-stone-800 dark:bg-stone-900">
      <div className={cn("absolute top-0 left-0 right-0 h-1", colors.bar)} />
      <div className="p-5 pt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">{value}</p>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400 truncate">{title}</p>
            {trend !== undefined && (
              <div className="mt-2 flex items-center gap-1.5">
                {trend >= 0 ? (
                  <TrendingUp size={14} className={colors.trendUp} />
                ) : (
                  <TrendingDown size={14} className={colors.trendDown} />
                )}
                <span className={cn("text-xs font-medium", trend >= 0 ? colors.trendUp : colors.trendDown)}>
                  {trend >= 0 ? "+" : ""}{trend}%
                </span>
                {trendLabel && <span className="text-xs text-stone-400 dark:text-stone-500">{trendLabel}</span>}
              </div>
            )}
          </div>
          {icon && (
            <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", colors.iconBg, colors.icon)}>
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}