import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { DollarSign } from "lucide-react"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"

interface FinanzaCardProps {
  id: number
  concepto: string
  monto: number
  tipo: "ingreso" | "gasto"
  categoria?: string
  fecha: string
  onClick?: (id: number) => void
}

function FinanzaCard({ id, concepto, monto, tipo, categoria, fecha, onClick }: FinanzaCardProps) {
  const isIngreso = tipo === "ingreso"

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick ? () => onClick(id) : undefined}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-stone-900">{concepto}</h3>
          {categoria && <p className="text-sm text-stone-500">{categoria}</p>}
          <p className="text-xs text-stone-400 mt-1">{formatDate(fecha)}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <DollarSign size={16} className={isIngreso ? "text-emerald-600" : "text-red-600"} />
            <span className={`text-lg font-bold ${isIngreso ? "text-emerald-600" : "text-red-600"}`}>
              {formatCurrency(monto)}
            </span>
          </div>
          <Badge color={isIngreso ? "success" : "error"}>{tipo}</Badge>
        </div>
      </div>
    </Card>
  )
}

export { FinanzaCard }
export type { FinanzaCardProps }
