"use client";

import { useMemo, useState } from "react";
import { Select } from "@/components/ui/select";
import { categoryTypeForName } from "@/lib/utils/expense-categories";
import type { ExpenseCategory, ExpenseType } from "@/types/database";

type ExpenseCategoryFieldsProps = {
  categories: ExpenseCategory[];
  defaultType?: ExpenseType;
  defaultCategoryId?: string | null;
};

export function ExpenseCategoryFields({
  categories,
  defaultType = "expense",
  defaultCategoryId,
}: ExpenseCategoryFieldsProps) {
  const [type, setType] = useState<ExpenseType>(defaultType);
  const [categoryId, setCategoryId] = useState(defaultCategoryId ?? "");
  const filteredCategories = useMemo(
    () => categories.filter((category) => categoryTypeForName(category.name) === type),
    [categories, type],
  );
  const selectedCategoryIsVisible = filteredCategories.some((category) => category.id === categoryId);
  const effectiveCategoryId = selectedCategoryIsVisible ? categoryId : "";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Select
        name="type"
        value={type}
        onChange={(event) => {
          const nextType = event.target.value as ExpenseType;
          setType(nextType);
          setCategoryId("");
        }}
        aria-label="種別"
      >
        <option value="expense">支出</option>
        <option value="income">収入</option>
      </Select>

      <Select
        name="category_id"
        value={effectiveCategoryId}
        onChange={(event) => setCategoryId(event.target.value)}
        aria-label="カテゴリ"
      >
        <option value="">カテゴリなし</option>
        {filteredCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
