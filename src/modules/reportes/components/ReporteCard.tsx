import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { BarChart3 } from "lucide-react"
import { formatDate } from "@/utils/formatDate"

interface ReporteCardProps {
  id: number
  nombre: string
  tipo: string
  fechaGeneracion: string
  descripcion?: string
  onClick?: (id: number) => void
}

function ReporteCard({ id, nombre, tipo, fechaGeneracion, descripcion, onClick }: ReporteCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick ? () => onClick(id) : undefined}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
          <BarChart3 size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-stone-900">{nombre}</h3>
          {descripcion && <p className="text-sm text-stone-500">{descripcion}</p>}
          <div className="mt-2 flex items-center gap-2">
            <Badge>{tipo}</Badge>
            <span className="text-xs text-stone-400">{formatDate(fechaGeneracion)}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export { ReporteCard }
export type { ReporteCardProps }
