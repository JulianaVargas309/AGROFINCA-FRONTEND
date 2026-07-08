import { RegisterForm } from "../components/RegisterForm"
import { Sprout } from "lucide-react"

function RegisterPage() {
  return (
    <div className="w-full">
      <div className="mb-6 text-center lg:hidden">
        <Sprout className="mx-auto h-10 w-10 text-emerald-700" />
        <h1 className="mt-2 text-2xl font-bold text-stone-900">AgroFinca Familiar</h1>
        <p className="text-sm text-stone-500">Sistema de gestión agrícola</p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stone-900">Crear Cuenta</h2>
        <p className="mt-1 text-sm text-stone-500">
          Regístrate con tu número de documento.
        </p>
      </div>

      <RegisterForm />
    </div>
  )
}

export default RegisterPage
