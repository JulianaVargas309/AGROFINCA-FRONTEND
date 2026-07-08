import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { ClipboardList } from "lucide-react"
import { formatRelativeDate } from "@/utils/formatDate"

interface BitacoraCardProps {
  id: number
  actividad: string
  fecha: string
  responsable: string
  tipo?: string
  onClick?: (id: number) => void
}

function BitacoraCard({ id, actividad, fecha, responsable, tipo, onClick }: BitacoraCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick ? () => onClick(id) : undefined}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
          <ClipboardList size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-stone-900">{actividad}</h3>
          <p className="text-sm text-stone-500">{responsable}</p>
          <div className="mt-2 flex items-center gap-2">
            {tipo && <Badge>{tipo}</Badge>}
            <span className="text-xs text-stone-400">{formatRelativeDate(fecha)}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export { BitacoraCard }
export type { BitacoraCardProps }
