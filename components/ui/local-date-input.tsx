"use client";

import { Input } from "@/components/ui/input";
import type { InputHTMLAttributes } from "react";

type LocalDateInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

function getLocalDateInputValue() {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function LocalDateInput({ defaultValue, ...props }: LocalDateInputProps) {
  return (
    <Input
      {...props}
      type="date"
      defaultValue={defaultValue ?? getLocalDateInputValue()}
    />
  );
}
