import { useParams, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { useTrabajador } from "../hooks/useTrabajador"
import { formatDate } from "@/utils/formatDate"
import { ArrowLeft } from "lucide-react"

function DetalleTrabajadorPage() {
  const { id } = useParams<{ id: string }>()
  const { trabajador, loading, error } = useTrabajador(id ? Number(id) : null)

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!trabajador) return <Alert severity="info">Trabajador no encontrado</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title={trabajador.nombre} description={trabajador.cargo} actions={
        <Link to="/app/trabajadores"><Button variant="outline"><ArrowLeft size={16} />Volver</Button></Link>
      } />
      <Card title="Información del Trabajador">
        <dl className="space-y-3">
          <div><dt className="text-sm text-stone-500">Documento</dt><dd>{trabajador.documento}</dd></div>
          <div><dt className="text-sm text-stone-500">Cargo</dt><dd>{trabajador.cargo}</dd></div>
          <div><dt className="text-sm text-stone-500">Teléfono</dt><dd>{trabajador.telefono || "-"}</dd></div>
          <div><dt className="text-sm text-stone-500">Dirección</dt><dd>{trabajador.direccion || "-"}</dd></div>
          <div><dt className="text-sm text-stone-500">Fecha de Ingreso</dt><dd>{formatDate(trabajador.fechaIngreso)}</dd></div>
          <div><dt className="text-sm text-stone-500">Estado</dt><dd><Badge color={trabajador.activo ? "success" : "default"}>{trabajador.activo ? "Activo" : "Inactivo"}</Badge></dd></div>
        </dl>
      </Card>
    </div>
  )
}

export default DetalleTrabajadorPage
