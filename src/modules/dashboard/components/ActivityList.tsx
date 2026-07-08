import { Card } from "@/components/ui/Card"
import { formatRelativeDate } from "@/utils/formatDate"
import type { ActividadReciente } from "../types/dashboard.types"
import { ClipboardList, MapPin } from "lucide-react"

interface ActivityListProps {
  activities: ActividadReciente[]
  loading?: boolean
}

export function ActivityList({ activities, loading }: ActivityListProps) {
  if (loading) {
    return (
      <Card>
        <h3 className="text-sm font-semibold text-stone-700">Actividad Reciente</h3>
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-stone-200 shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-3 w-full rounded bg-stone-100" />
                <div className="h-2 w-20 rounded bg-stone-100" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-stone-700">Actividad Reciente</h3>
      <div className="mt-4 space-y-4">
        {activities.length === 0 ? (
          <div className="py-4 text-center">
            <ClipboardList size={32} className="mx-auto text-stone-300" />
            <p className="mt-2 text-sm text-stone-500">Sin actividad reciente.</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <span className="mt-1.5 block h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-stone-700 truncate">
                    {activity.actividad}
                  </p>
                  {activity.lote && (
                    <span className="flex items-center gap-1 text-xs text-stone-400 shrink-0">
                      <MapPin size={10} />
                      {activity.lote}
                    </span>
                  )}
                </div>
                {activity.descripcion && activity.descripcion !== activity.actividad && (
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{activity.descripcion}</p>
                )}
                <p className="text-xs text-stone-400 mt-0.5">
                  {formatRelativeDate(activity.fecha)}
                  {activity.usuario && ` · ${activity.usuario}`}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
