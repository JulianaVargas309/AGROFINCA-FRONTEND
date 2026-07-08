import { Link } from "react-router-dom"
import { Card } from "@/components/ui/Card"
import {
  MapPin,
  Sprout,
  Package,
  ClipboardList,
  DollarSign,
  BarChart3,
} from "lucide-react"
import { ROUTES } from "@/constants/routes"

const quickLinks = [
  { to: ROUTES.FINCAS, label: "Fincas", icon: MapPin, color: "text-emerald-600" },
  { to: ROUTES.LOTES, label: "Lotes", icon: Sprout, color: "text-amber-600" },
  { to: ROUTES.INVENTARIO, label: "Inventario", icon: Package, color: "text-sky-600" },
  { to: ROUTES.BITACORA, label: "Bitácora", icon: ClipboardList, color: "text-purple-600" },
  { to: ROUTES.FINANZAS, label: "Finanzas", icon: DollarSign, color: "text-red-600" },
  { to: ROUTES.REPORTES, label: "Reportes", icon: BarChart3, color: "text-stone-600" },
]

function QuickLinks() {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-stone-700 mb-3">Accesos Rápidos</h3>
      <div className="grid grid-cols-2 gap-2">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-colors"
          >
            <link.icon size={18} className={link.color} />
            {link.label}
          </Link>
        ))}
      </div>
    </Card>
  )
}

export { QuickLinks }
