import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { MapPin, Ruler } from "lucide-react"

interface FincaCardProps {
  id: number
  nombre: string
  ubicacion: string
  hectareas: number
  lotesCount?: number
  onClick?: (id: number) => void
}

function FincaCard({ id, nombre, ubicacion, hectareas, lotesCount, onClick }: FincaCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick ? () => onClick(id) : undefined}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-stone-900">{nombre}</h3>
          <div className="mt-2 flex items-center gap-1 text-sm text-stone-500">
            <MapPin size={14} />
            <span>{ubicacion}</span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className="flex items-center gap-1 text-sm text-stone-600">
              <Ruler size={14} />
              {hectareas} ha
            </span>
            {lotesCount !== undefined && (
              <Badge color="info">{lotesCount} lotes</Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export { FincaCard }
export type { FincaCardProps }
