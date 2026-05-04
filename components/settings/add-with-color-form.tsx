"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ColorPicker } from "@/components/settings/color-picker";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

type AddWithColorFormProps = {
  action: (formData: FormData) => void;
  placeholder: string;
  showBadgePreview?: boolean;
};

export function AddWithColorForm({ action, placeholder, showBadgePreview }: AddWithColorFormProps) {
  const [color, setColor] = useState("#94a3b8");
  const [name, setName] = useState("");

  return (
    <form action={action} className="space-y-3 px-3 pb-3">
      <div className="flex gap-2">
        <Input name="name" placeholder={placeholder} value={name} onChange={(e) => setName(e.target.value)} required />
        <SubmitButton size="sm" className="shrink-0">
          <Plus className="size-4" aria-hidden />
          追加
        </SubmitButton>
      </div>
      <input type="hidden" name="color" value={color} />
      <ColorPicker
        value={color}
        name={showBadgePreview && name ? name : undefined}
        onChange={setColor}
      />
    </form>
  );
}
