import { useState, useCallback } from "react"
import { useAuth } from "@/hooks/useAuth"
import { perfilService } from "../services/perfil.service"

interface UsePerfilReturn {
  saving: boolean
  error: string | null
  successMessage: string | null
  updateProfile: (data: { nombre: string; documento: string }) => Promise<void>
  changePassword: (data: { newPassword: string }) => Promise<void>
  clearMessages: () => void
}

export function usePerfil(): UsePerfilReturn {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccessMessage(null)
  }, [])

  const updateProfile = useCallback(
    async (data: { nombre: string; documento: string }) => {
      if (!user?.id) return
      setSaving(true)
      clearMessages()
      try {
        await perfilService.updateProfile(user.id, data)
        setSuccessMessage("Perfil actualizado correctamente.")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al actualizar perfil")
      } finally {
        setSaving(false)
      }
    },
    [user?.id, clearMessages],
  )

  const changePassword = useCallback(
    async (data: { newPassword: string }) => {
      if (!user?.id) return
      setSaving(true)
      clearMessages()
      try {
        await perfilService.changePassword(user.id, data.newPassword)
        setSuccessMessage("Contraseña cambiada correctamente.")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cambiar contraseña")
      } finally {
        setSaving(false)
      }
    },
    [user?.id, clearMessages],
  )

  return { saving, error, successMessage, updateProfile, changePassword, clearMessages }
}
