import { useParams, Link } from "react-router-dom"
import { PageHeader, Breadcrumb } from "@/components/layout"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { BackButton } from "@/components/shared/BackButton"
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
          <div className="flex gap-2">
            <BackButton to="/app/cultivos" />
            <Link to={`/app/cultivos/${cultivo.id}/editar`}>
              <Button variant="outline">
                <Edit size={16} />
                Editar
              </Button>
            </Link>
          </div>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Información General">
          <dl className="space-y-3">
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Nombre</dt><dd className="dark:text-stone-100">{cultivo.nombre}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Tipo</dt><dd className="dark:text-stone-100">{cultivo.tipo}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Variedad</dt><dd className="dark:text-stone-100">{cultivo.variedad || "-"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Estado</dt><dd><Badge color="success">{cultivo.estado}</Badge></dd></div>
          </dl>
        </Card>
        <Card title="Datos del Cultivo">
          <dl className="space-y-3">
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Fecha de Siembra</dt><dd className="dark:text-stone-100">{cultivo.fechaSiembra ? formatDate(cultivo.fechaSiembra) : "-"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Área Sembrada</dt><dd className="dark:text-stone-100">{cultivo.areaSembrada ? `${cultivo.areaSembrada} ha` : "-"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Lote</dt><dd className="dark:text-stone-100">{cultivo.lote?.nombre || "-"}</dd></div>
            <div><dt className="text-sm text-stone-500 dark:text-stone-400">Finca</dt><dd className="dark:text-stone-100">{cultivo.finca?.nombre || "-"}</dd></div>
          </dl>
        </Card>
      </div>
    </div>
  )
}

export default DetalleCultivoPage
