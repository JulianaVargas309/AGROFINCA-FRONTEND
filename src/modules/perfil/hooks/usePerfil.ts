import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/useAuth"
import { perfilService } from "../services/perfil.service"
import type { PerfilData } from "../types/perfil.types"

interface UsePerfilReturn {
  profile: PerfilData | null
  loadingProfile: boolean
  saving: boolean
  error: string | null
  successMessage: string | null
  updateProfile: (data: { nombre: string; documento: string }) => Promise<void>
  changePassword: (data: { newPassword: string }) => Promise<void>
  clearMessages: () => void
}

export function usePerfil(): UsePerfilReturn {
  const { user } = useAuth()
  const [profile, setProfile] = useState<PerfilData | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccessMessage(null)
  }, [])

  const loadProfile = useCallback(async () => {
    if (!user?.id) return
    setLoadingProfile(true)
    try {
      const data = await perfilService.getProfile(user.id)
      setProfile(data)
    } catch {
      // non-critical
    } finally {
      setLoadingProfile(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const updateProfile = useCallback(
    async (data: { nombre: string; documento: string }) => {
      if (!user?.id) return
      setSaving(true)
      clearMessages()
      try {
        await perfilService.updateProfile(user.id, data)
        setSuccessMessage("Perfil actualizado correctamente.")
        loadProfile()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al actualizar perfil")
      } finally {
        setSaving(false)
      }
    },
    [user?.id, clearMessages, loadProfile],
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

  return { profile, loadingProfile, saving, error, successMessage, updateProfile, changePassword, clearMessages }
}