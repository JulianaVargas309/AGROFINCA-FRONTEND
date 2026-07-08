import { Card } from "@/components/ui/Card"
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

const colorMap = {
  default: { bg: "bg-stone-50", text: "text-stone-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
  sky: { bg: "bg-sky-50", text: "text-sky-600" },
  red: { bg: "bg-red-50", text: "text-red-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
}

export function StatsCard({ title, value, icon, trend, trendLabel, color = "default" }: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-stone-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-stone-900">{value}</p>
          {trend !== undefined && (
            <div className="mt-1 flex items-center gap-1">
              {trend >= 0 ? (
                <TrendingUp size={14} className="text-emerald-600" />
              ) : (
                <TrendingDown size={14} className="text-red-600" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  trend >= 0 ? "text-emerald-600" : "text-red-600",
                )}
              >
                {trend >= 0 ? "+" : ""}
                {trend}%
              </span>
              {trendLabel && <span className="text-xs text-stone-400">{trendLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg", colorMap[color].bg, colorMap[color].text)}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
