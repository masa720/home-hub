import { ExternalLink, Heart, Trash2, Utensils } from "lucide-react";
import { notFound } from "next/navigation";
import { addRecipeToMealPlan, deleteRecipe, toggleRecipeCooked, toggleRecipeFavorite } from "@/app/(app)/recipes/actions";
import { IngredientForm } from "@/components/recipes/ingredient-form";
import { IngredientList } from "@/components/recipes/ingredient-list";
import { RecipeForm } from "@/components/recipes/recipe-form";
import { Button } from "@/components/ui/button";
import { CancelButton } from "@/components/ui/cancel-button";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { getRecipeById } from "@/lib/db/recipes";
import { createClient } from "@/lib/supabase/server";
import { toDateInputValue } from "@/lib/utils/dates";

type RecipeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const recipe = await getRecipeById(supabase, id).catch(() => null);

  if (!recipe) notFound();

  return (
    <>
      <header className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-emerald-300">レシピ詳細</p>
          <h1 className="mt-1 text-2xl font-bold text-white">{recipe.title}</h1>
          {recipe.description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{recipe.description}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <form action={toggleRecipeCooked}>
            <input type="hidden" name="id" value={recipe.id} />
            <input type="hidden" name="is_cooked" value={String(recipe.is_cooked)} />
            <input type="hidden" name="cooked_count" value={recipe.cooked_count} />
            <SubmitButton variant={recipe.is_cooked ? "secondary" : "outline"} size="sm">
              <Utensils className="size-4" aria-hidden />
              {recipe.is_cooked ? `作った ${recipe.cooked_count}回` : "未作成"}
            </SubmitButton>
          </form>
          <form action={toggleRecipeFavorite}>
            <input type="hidden" name="id" value={recipe.id} />
            <input type="hidden" name="is_favorite" value={String(recipe.is_favorite)} />
            <SubmitButton variant="ghost" size="sm">
              <Heart className={recipe.is_favorite ? "size-4 fill-rose-400 text-rose-400" : "size-4"} aria-hidden />
              お気に入り
            </SubmitButton>
          </form>
          {[recipe.youtube_url, recipe.url_1, recipe.url_2].filter(Boolean).map((url, index) => (
            <Button key={url} asChild variant="ghost" size="sm">
              <a href={url ?? "#"} target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" aria-hidden />
                URL {index + 1}
              </a>
            </Button>
          ))}
        </div>
      </header>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="mb-3 font-semibold text-white">献立に追加</h2>
        <form action={addRecipeToMealPlan} className="grid gap-3 sm:grid-cols-[1fr_10rem_auto]">
          <input type="hidden" name="recipe_id" value={recipe.id} />
          <input type="hidden" name="title" value={recipe.title} />
          <input
            name="date"
            type="date"
            defaultValue={toDateInputValue(new Date())}
            className="h-12 rounded-lg border bg-slate-950/60 px-3 text-sm"
            required
          />
          <Select name="meal_type" defaultValue="dinner">
            <option value="lunch">ランチ</option>
            <option value="dinner">ディナー</option>
          </Select>
          <div className="flex gap-2">
            <CancelButton />
            <SubmitButton>追加</SubmitButton>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">材料</h2>
        <IngredientList recipeId={recipe.id} ingredients={recipe.ingredients} />
        <IngredientForm recipeId={recipe.id} />
      </section>

      <details className="rounded-lg border bg-card p-4">
        <summary className="cursor-pointer list-none font-semibold text-white">レシピを編集</summary>
        <div className="mt-4">
          <RecipeForm recipe={recipe} />
        </div>
      </details>

      {recipe.memo ? (
        <section className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold text-white">メモ</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{recipe.memo}</p>
        </section>
      ) : null}

      <form action={deleteRecipe}>
        <input type="hidden" name="id" value={recipe.id} />
        <input type="hidden" name="redirect_after" value="true" />
        <SubmitButton variant="danger" className="w-full">
          <Trash2 className="size-4" aria-hidden />
          レシピを削除
        </SubmitButton>
      </form>
    </>
  );
}
