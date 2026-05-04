export function isIncomeCategoryName(name: string | null | undefined) {
  return name === "給与" || name === "副業";
}

export function categoryTypeForName(name: string | null | undefined) {
  return isIncomeCategoryName(name) ? "income" : "expense";
}
