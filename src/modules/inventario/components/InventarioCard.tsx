import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Package } from "lucide-react"

interface InventarioCardProps {
  id: number
  producto: string
  categoria: string
  cantidad: number
  unidad: string
  stockBajo?: boolean
  onClick?: (id: number) => void
}

function InventarioCard({ id, producto, categoria, cantidad, unidad, stockBajo, onClick }: InventarioCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick ? () => onClick(id) : undefined}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <Package size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-stone-900">{producto}</h3>
            {stockBajo && <Badge color="error">Stock bajo</Badge>}
          </div>
          <p className="text-sm text-stone-500">{categoria}</p>
          <p className="mt-1 text-sm font-medium text-stone-700">
            {cantidad} {unidad}
          </p>
        </div>
      </div>
    </Card>
  )
}

export { InventarioCard }
export type { InventarioCardProps }
