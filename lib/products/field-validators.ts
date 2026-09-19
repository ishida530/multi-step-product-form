import type { z } from "zod";

type FieldError = { message: string } | undefined;

/**
 * Błąd ze schematu przypisany do jednego pola.
 * Dzięki temu reguły zależne od kilku pól (np. min ≤ maks) są zapisane tylko w schemacie Zod,
 * a pole pokazuje komunikat, gdy schemat zgłasza problem na jego ścieżce.
 */
export function fieldErrorFromSchema(
  schema: z.ZodType,
  values: unknown,
  field: string
): FieldError {
  const result = schema.safeParse(values);
  if (result.success) return undefined;

  const issue = result.error.issues.find((item) => item.path[0] === field);
  return issue ? { message: issue.message } : undefined;
}
