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
      const raw: Record<string, unknown> = await perfilService.getProfile(user.id) as unknown as Record<string, unknown>
      console.log("[Perfil] API response:", raw)
      const mapped: PerfilData = {
        id: Number(raw.id) || 0,
        nombre: String(raw.nombre ?? raw.name ?? ""),
        apellido: raw.apellido as string | undefined,
        documento: String(raw.documento ?? raw.document ?? ""),
        correo: (raw.correo ?? raw.email ?? raw.mail ?? "") as string | undefined,
        telefono: (raw.telefono ?? raw.phone ?? raw.tel ?? "") as string | undefined,
        rol: String(raw.rol ?? raw.role ?? ""),
        foto: (raw.foto ?? raw.photo ?? raw.fotoUrl ?? raw.avatar ?? "") as string | undefined,
        ultimoAcceso: (raw.ultimoAcceso ?? raw.ultimo_acceso ?? raw.lastLogin ?? raw.last_login ?? raw.lastAccess ?? "") as string | undefined,
        activo: Boolean(raw.activo ?? raw.active ?? true),
        createdAt: String(raw.createdAt ?? raw.created_at ?? raw.fechaCreacion ?? ""),
      }
      setProfile(mapped)
    } catch (err) {
      console.warn("[Perfil] Error al cargar perfil:", err)
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