import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Alert } from "@/components/ui/Alert"
import { authService } from "../services/auth.service"
import { Mail, ArrowLeft } from "lucide-react"
import { documentoValidator } from "@/utils/validators"

const forgotPasswordSchema = z.object({
  documento: documentoValidator,
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

function RecuperarPasswordPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(forgotPasswordSchema) as any,
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null)
    setLoading(true)
    try {
      await authService.forgotPassword(data.documento)
      setSent(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al procesar la solicitud"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <Card className="text-center space-y-4 p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <Mail className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold text-stone-900">Solicitud Enviada</h2>
        <p className="text-stone-600">
          Si el documento está registrado, recibirás instrucciones para recuperar tu contraseña.
        </p>
        <Link
          to="/login"
          className="inline-block text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          Volver al inicio de sesión
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-stone-900">Recuperar Contraseña</h1>
        <p className="mt-2 text-sm text-stone-600">
          Ingresa tu número de documento y te enviaremos instrucciones
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <Alert severity="error">{error}</Alert>}

          <Input
            label="Número de Documento"
            placeholder="Tu documento"
            error={errors.documento?.message}
            {...register("documento")}
          />

          <Button type="submit" className="w-full" disabled={loading} loading={loading}>
            {loading ? "Enviando..." : "Enviar Instrucciones"}
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm text-stone-600">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:text-emerald-800"
        >
          <ArrowLeft size={14} />
          Volver al inicio de sesión
        </Link>
      </p>
    </div>
  )
}

export default RecuperarPasswordPage
