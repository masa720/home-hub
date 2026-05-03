export type ActionState = {
  ok?: boolean;
  message?: string;
};

export function optionalString(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

export function requiredString(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}
