import { useFieldContext } from "../form-context";

/** Typowany dostęp do pola z kontekstu + błędy widoczne dopiero po interakcji z polem. */
export function useFormField<TValue>() {
  const field = useFieldContext<TValue>();
  const errors = field.state.meta.isTouched ? field.state.meta.errors : [];

  return { field, errors, invalid: errors.length > 0 };
}
