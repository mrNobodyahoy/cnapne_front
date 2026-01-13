// src/types/teacherGuidanceSchema.ts
import { z } from "zod";

export const createTeacherGuidanceSchema = z.object({
  guidanceDetails: z
    .string()
    .min(1, "Os detalhes da orientação são obrigatórios"),
  recommendations: z.string().min(1, "As recomendações são obrigatórias"),
  domiciliar: z.preprocess((val) => String(val) === "true", z.boolean()),
});

export type CreateTeacherGuidanceFormData = z.infer<
  typeof createTeacherGuidanceSchema
>;
