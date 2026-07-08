import { PageHeader, Breadcrumb } from "@/components/layout"
import { ConfiguracionForm } from "../components/ConfiguracionForm"

function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      <PageHeader title="Configuración" description="Ajustes y preferencias del sistema" />
      <ConfiguracionForm />
    </div>
  )
}

export default ConfiguracionPage
