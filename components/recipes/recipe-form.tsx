import { Save } from "lucide-react";
import { createRecipe, updateRecipe } from "@/app/(app)/recipes/actions";
import { UrlInput } from "@/components/recipes/url-input";
import { CancelButton } from "@/components/ui/cancel-button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import type { Recipe } from "@/types/database";

type RecipeFormProps = {
  recipe?: Recipe;
};

export function RecipeForm({ recipe }: RecipeFormProps) {
  const action = recipe ? updateRecipe : createRecipe;

  return (
    <form action={action} className="space-y-3 rounded-lg border bg-card p-4">
      {recipe ? <input type="hidden" name="id" value={recipe.id} /> : null}
      <Input name="title" placeholder="料理名" defaultValue={recipe?.title ?? ""} required />
      <Textarea name="memo" placeholder="メモ" defaultValue={recipe?.memo ?? ""} />
      <UrlInput name="url_1" placeholder="URL 1" defaultValue={recipe?.url_1 ?? ""} />
      <UrlInput name="url_2" placeholder="URL 2" defaultValue={recipe?.url_2 ?? ""} />
      <UrlInput name="url_3" placeholder="URL 3" defaultValue={recipe?.url_3 ?? ""} />
      <div className="flex justify-end gap-2">
        <CancelButton />
        <SubmitButton>
          <Save className="size-4" aria-hidden />
          {recipe ? "更新" : "保存"}
        </SubmitButton>
      </div>
    </form>
  );
}
