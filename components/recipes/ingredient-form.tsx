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
    <form action={createIngredient} className="space-y-3 rounded-2xl bg-card p-4 shadow-card">
      <input type="hidden" name="recipe_id" value={recipeId} />
      <Input name="name" placeholder="Ingredient name" required />
      <div className="grid grid-cols-2 gap-3">
        <Input name="quantity" placeholder="Qty" />
        <Input name="unit" placeholder="Unit" />
      </div>
      <Input name="note" placeholder="Note" />
      <div className="flex justify-end gap-2">
        <CancelButton />
        <SubmitButton size="sm">
          <Plus className="size-4" aria-hidden />
          Add
        </SubmitButton>
      </div>
    </form>
  );
}
