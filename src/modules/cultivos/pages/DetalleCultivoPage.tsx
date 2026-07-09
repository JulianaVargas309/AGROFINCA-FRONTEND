import { useParams, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { useCultivo } from "../hooks/useCultivo"
import { formatDate } from "@/utils/formatDate"
import { Edit } from "lucide-react"

function DetalleCultivoPage() {
  const { id } = useParams<{ id: string }>()
  const { cultivo, loading, error } = useCultivo(id ? Number(id) : null)

  if (loading) return <Spinner />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!cultivo) return <Alert severity="info">Cultivo no encontrado</Alert>

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader
        title={cultivo.nombre}
        description={`${cultivo.tipo} - ${cultivo.variedad || "Sin variedad"}`}
        actions={
          <Link to={`/app/cultivos/${cultivo.id}/editar`}>
            <Button variant="outline">
              <Edit size={16} />
              Editar
            </Button>
          </Link>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Información General">
          <dl className="space-y-3">
            <div><dt className="text-sm text-stone-500">Nombre</dt><dd className="font-medium">{cultivo.nombre}</dd></div>
            <div><dt className="text-sm text-stone-500">Tipo</dt><dd>{cultivo.tipo}</dd></div>
            <div><dt className="text-sm text-stone-500">Variedad</dt><dd>{cultivo.variedad || "-"}</dd></div>
            <div><dt className="text-sm text-stone-500">Estado</dt><dd><Badge color="success">{cultivo.estado}</Badge></dd></div>
          </dl>
        </Card>
        <Card title="Datos del Cultivo">
          <dl className="space-y-3">
            <div><dt className="text-sm text-stone-500">Fecha de Siembra</dt><dd>{cultivo.fechaSiembra ? formatDate(cultivo.fechaSiembra) : "-"}</dd></div>
            <div><dt className="text-sm text-stone-500">Área Sembrada</dt><dd>{cultivo.areaSembrada ? `${cultivo.areaSembrada} ha` : "-"}</dd></div>
            <div><dt className="text-sm text-stone-500">Lote</dt><dd>{cultivo.lote?.nombre || "-"}</dd></div>
            <div><dt className="text-sm text-stone-500">Finca</dt><dd>{cultivo.finca?.nombre || "-"}</dd></div>
          </dl>
        </Card>
      </div>
    </div>
  )
}

export default DetalleCultivoPage
