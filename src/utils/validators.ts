import { z } from "zod"

export const emailValidator = z.string().email("Correo electrónico inválido")

export const documentoValidator = z
  .string()
  .min(6, "El documento debe tener al menos 6 dígitos")
  .max(12, "El documento no puede exceder 12 dígitos")

export const passwordValidator = z
  .string()
  .min(6, "La contraseña debe tener al menos 6 caracteres")
  .max(100, "La contraseña no puede exceder 100 caracteres")

export const nombreValidator = z
  .string()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(100, "El nombre no puede exceder 100 caracteres")

export const phoneValidator = z
  .string()
  .regex(/^\+?[\d\s-]{7,15}$/, "Número de teléfono inválido")
  .optional()
  .or(z.literal(""))

export const optionalString = z.string().optional().or(z.literal(""))

export const positiveNumber = z.coerce.number().positive("Debe ser un número positivo")

export const nonNegativeNumber = z.coerce.number().min(0, "No puede ser negativo")

export const idValidator = z.coerce.number().int().positive("ID inválido")
