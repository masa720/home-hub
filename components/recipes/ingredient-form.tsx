import { Plus } from "lucide-react";
import { createIngredient } from "@/app/(app)/recipes/actions";
import { CancelButton } from "@/components/ui/cancel-button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

type IngredientFormProps = {
  recipeId: string;
};

export function IngredientForm({ recipeId }: IngredientFormProps) {
  return (
    <form action={createIngredient} className="space-y-3 rounded-lg border bg-card p-4">
      <input type="hidden" name="recipe_id" value={recipeId} />
      <Input name="name" placeholder="材料名" required />
      <div className="grid grid-cols-2 gap-3">
        <Input name="quantity" placeholder="数量" />
        <Input name="unit" placeholder="単位" />
      </div>
      <Input name="note" placeholder="メモ" />
      <div className="flex justify-end gap-2">
        <CancelButton />
        <SubmitButton variant="secondary">
          <Plus className="size-4" aria-hidden />
          材料追加
        </SubmitButton>
      </div>
    </form>
  );
}
