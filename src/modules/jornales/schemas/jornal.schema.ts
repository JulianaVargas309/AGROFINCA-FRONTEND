import { z } from "zod"

export const createJornalSchema = z.object({
  fecha: z.string().min(1, "Seleccione una fecha"),
  tipoPago: z.enum(["DIA", "KILO"], { required_error: "Seleccione un tipo de pago" }),
  valorDia: z.coerce.number().positive("Debe ser positivo").optional(),
  cantidadDias: z.coerce.number().positive("Debe ser positivo").optional(),
  cantidadKg: z.coerce.number().positive("Debe ser positivo").optional(),
  valorKilo: z.coerce.number().positive("Debe ser positivo").optional(),
  total: z.coerce.number().min(0, "El total debe ser mayor o igual a 0"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  trabajadorId: z.coerce.number().positive("Seleccione un trabajador"),
  loteId: z.coerce.number().positive().optional(),
})

export const updateJornalSchema = z.object({
  fecha: z.string().optional(),
  tipoPago: z.enum(["DIA", "KILO"]).optional(),
  valorDia: z.coerce.number().positive("Debe ser positivo").optional(),
  cantidadDias: z.coerce.number().positive("Debe ser positivo").optional(),
  cantidadKg: z.coerce.number().positive("Debe ser positivo").optional(),
  valorKilo: z.coerce.number().positive("Debe ser positivo").optional(),
  total: z.coerce.number().min(0).optional(),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  trabajadorId: z.coerce.number().positive().optional(),
  loteId: z.coerce.number().positive().optional(),
})

export type CreateJornalFormData = z.infer<typeof createJornalSchema>
export type UpdateJornalFormData = z.infer<typeof updateJornalSchema>
