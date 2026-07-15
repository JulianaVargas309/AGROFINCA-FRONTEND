import { z } from "zod"

export const createCajaSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(200, "Máximo 200 caracteres"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
})

export const createMovimientoSchema = z.object({
  tipo: z.enum(["INGRESO", "EGRESO", "TRASLADO"], { required_error: "Seleccione un tipo" }),
  monto: z.coerce.number().positive("Debe ser un monto positivo"),
  concepto: z.string().min(3, "Mínimo 3 caracteres").max(300, "Máximo 300 caracteres"),
  referencia: z.string().max(200, "Máximo 200 caracteres").optional().or(z.literal("")),
  cajaId: z.coerce.number().positive("Seleccione una caja"),
})

export type CreateCajaFormData = z.infer<typeof createCajaSchema>
export type CreateMovimientoFormData = z.infer<typeof createMovimientoSchema>
