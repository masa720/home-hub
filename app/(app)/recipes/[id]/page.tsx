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
import { cn } from "@/lib/utils/cn";
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
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Recipe</p>
        <h1 className="mt-1 text-xl font-bold text-foreground">{recipe.title}</h1>
        {recipe.description ? <p className="mt-1 text-sm text-muted-foreground">{recipe.description}</p> : null}
        <div className="mt-3 flex items-center gap-1">
          <form action={toggleRecipeCooked}>
            <input type="hidden" name="id" value={recipe.id} />
            <input type="hidden" name="is_cooked" value={String(recipe.is_cooked)} />
            <input type="hidden" name="cooked_count" value={recipe.cooked_count} />
            <SubmitButton
              variant="ghost"
              size="sm"
              className={cn("h-8 min-h-8 gap-1 text-xs", recipe.is_cooked && "text-success")}
            >
              <Utensils className="size-3.5" aria-hidden />
              {recipe.is_cooked ? `${recipe.cooked_count}x` : "New"}
            </SubmitButton>
          </form>
          <form action={toggleRecipeFavorite}>
            <input type="hidden" name="id" value={recipe.id} />
            <input type="hidden" name="is_favorite" value={String(recipe.is_favorite)} />
            <SubmitButton variant="ghost" size="sm" className="h-8 min-h-8 gap-1 text-xs">
              <Heart className={cn("size-3.5", recipe.is_favorite && "fill-rose-500 text-rose-500")} aria-hidden />
              Fav
            </SubmitButton>
          </form>
          {[recipe.youtube_url, recipe.url_1, recipe.url_2].filter(Boolean).map((url, index) => (
            <Button key={url} asChild variant="ghost" size="sm" className="h-8 min-h-8 gap-1 text-xs">
              <a href={url ?? "#"} target="_blank" rel="noreferrer">
                <ExternalLink className="size-3.5" aria-hidden />
                URL{index + 1}
              </a>
            </Button>
          ))}
        </div>
      </header>

      <section className="rounded-2xl bg-card p-4 shadow-card">
        <h2 className="mb-3 text-sm font-bold text-foreground">Add to meal plan</h2>
        <form action={addRecipeToMealPlan} className="flex flex-wrap gap-2">
          <input type="hidden" name="recipe_id" value={recipe.id} />
          <input type="hidden" name="title" value={recipe.title} />
          <input
            name="date"
            type="date"
            defaultValue={toDateInputValue(new Date())}
            className="h-10 flex-1 rounded-xl border bg-card px-3 text-sm"
            required
          />
          <Select name="meal_type" defaultValue="dinner" className="h-10 w-28 min-w-0">
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </Select>
          <div className="flex gap-2">
            <CancelButton />
            <SubmitButton size="sm">Add</SubmitButton>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-foreground">Ingredients</h2>
        <IngredientList recipeId={recipe.id} ingredients={recipe.ingredients} />
        <IngredientForm recipeId={recipe.id} />
      </section>

      <details className="rounded-2xl bg-card p-4 shadow-card">
        <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">Edit recipe</summary>
        <div className="mt-4">
          <RecipeForm recipe={recipe} />
        </div>
      </details>

      {recipe.memo ? (
        <section className="rounded-2xl bg-card p-4 shadow-card">
          <h2 className="text-sm font-bold text-foreground">Memo</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{recipe.memo}</p>
        </section>
      ) : null}

      <form action={deleteRecipe}>
        <input type="hidden" name="id" value={recipe.id} />
        <input type="hidden" name="redirect_after" value="true" />
        <SubmitButton variant="danger" className="w-full">
          <Trash2 className="size-4" aria-hidden />
          Delete recipe
        </SubmitButton>
      </form>
    </>
  );
}
