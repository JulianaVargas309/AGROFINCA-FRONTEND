import { useParams } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { BackButton } from "@/components/shared/BackButton"
import { useTrabajador } from "../hooks/useTrabajador"
import { formatDate } from "@/utils/formatDate"
import { formatCurrency } from "@/utils/formatCurrency"
import { User, IdCard, Phone, MapPin, Calendar, DollarSign, FileText } from "lucide-react"

function DetalleTrabajadorPage() {
  const { id } = useParams<{ id: string }>()
  const { trabajador, loading, error } = useTrabajador(id ? Number(id) : null)

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!trabajador) return <Alert severity="info">Trabajador no encontrado</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title={`${trabajador.nombre} ${trabajador.apellido || ""}`} description={trabajador.cargo} actions={<BackButton to="/app/trabajadores" />} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-2 text-stone-500 mb-1 dark:text-stone-400"><User size={16} /><span className="text-xs font-medium">Nombre</span></div>
          <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{trabajador.nombre} {trabajador.apellido || ""}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-stone-500 mb-1 dark:text-stone-400"><IdCard size={16} /><span className="text-xs font-medium">Documento</span></div>
          <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{trabajador.documento}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-stone-500 mb-1 dark:text-stone-400"><MapPin size={16} /><span className="text-xs font-medium">Dirección</span></div>
          <p className="text-sm text-stone-700 dark:text-stone-200">{trabajador.direccion || "-"}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-stone-500 mb-1 dark:text-stone-400"><Calendar size={16} /><span className="text-xs font-medium">Estado</span></div>
          <Badge color={trabajador.activo ? "success" : "default"}>{trabajador.activo ? "Activo" : "Inactivo"}</Badge>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-stone-500 mb-1 dark:text-stone-400"><Phone size={16} /><span className="text-xs font-medium">Teléfono</span></div>
          <p className="text-sm text-stone-700 dark:text-stone-200">{trabajador.telefono || "-"}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-stone-500 mb-1 dark:text-stone-400"><User size={16} /><span className="text-xs font-medium">Cargo</span></div>
          <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{trabajador.cargo}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-stone-500 mb-1 dark:text-stone-400"><Calendar size={16} /><span className="text-xs font-medium">Ingreso</span></div>
          <p className="text-sm text-stone-700 dark:text-stone-200">{formatDate(trabajador.fechaIngreso)}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-stone-500 mb-1 dark:text-stone-400"><DollarSign size={16} /><span className="text-xs font-medium">Salario</span></div>
          <p className="text-sm text-stone-700 dark:text-stone-200">{trabajador.salario ? formatCurrency(trabajador.salario) : "-"}</p>
        </Card>
      </div>
      {trabajador.observaciones && (
        <Card>
          <div className="flex items-center gap-2 text-stone-500 mb-2 dark:text-stone-400"><FileText size={16} /><span className="text-xs font-medium">Observaciones</span></div>
          <p className="text-sm text-stone-700 dark:text-stone-200">{trabajador.observaciones}</p>
        </Card>
      )}
    </div>
  )
}

export default DetalleTrabajadorPage
