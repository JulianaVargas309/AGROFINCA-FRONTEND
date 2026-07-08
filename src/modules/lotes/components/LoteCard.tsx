import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Sprout } from "lucide-react"

interface LoteCardProps {
  id: number
  nombre: string
  cultivo: string
  estado: string
  area: number
  onClick?: (id: number) => void
}

function LoteCard({ id, nombre, cultivo, estado, area, onClick }: LoteCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick ? () => onClick(id) : undefined}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <Sprout size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-stone-900">{nombre}</h3>
          <p className="text-sm text-stone-500">{cultivo}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge>{estado}</Badge>
            <span className="text-xs text-stone-400">{area} ha</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export { LoteCard }
export type { LoteCardProps }
