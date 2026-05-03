import { Save } from "lucide-react";
import { createRecipe, updateRecipe } from "@/app/(app)/recipes/actions";
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
      <Textarea name="description" placeholder="説明" defaultValue={recipe?.description ?? ""} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="youtube_url" type="url" placeholder="YouTube URL" defaultValue={recipe?.youtube_url ?? ""} />
        <Input name="url_1" type="url" placeholder="レシピURL" defaultValue={recipe?.url_1 ?? ""} />
      </div>
      <Input name="url_2" type="url" placeholder="予備URL" defaultValue={recipe?.url_2 ?? ""} />
      <Textarea name="memo" placeholder="メモ" defaultValue={recipe?.memo ?? ""} />
      {!recipe ? (
        <Textarea
          name="ingredients_text"
          placeholder={"材料をまとめて追加\n例: 玉ねぎ | 1 | 個 | みじん切り"}
        />
      ) : null}
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
