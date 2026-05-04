import { Search } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { RecipeForm } from "@/components/recipes/recipe-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRecipes } from "@/lib/db/recipes";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/server";

type RecipesPageProps = {
  searchParams: Promise<{ q?: string; filter?: string }>;
};

const filters = [
  { href: "/recipes", value: "all", label: "All" },
  { href: "/recipes?filter=uncooked", value: "uncooked", label: "New" },
  { href: "/recipes?filter=cooked", value: "cooked", label: "Cooked" },
  { href: "/recipes?filter=favorite", value: "favorite", label: "Fav" },
];

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const params = await searchParams;
  const q = params.q?.trim().toLowerCase() ?? "";
  const filter = params.filter ?? "all";
  const supabase = await createClient();
  const recipes = await getRecipes(supabase);
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesQuery = !q || recipe.title.toLowerCase().includes(q) || recipe.description?.toLowerCase().includes(q);
    const matchesFilter =
      filter === "favorite"
        ? recipe.is_favorite
        : filter === "cooked"
          ? recipe.is_cooked
          : filter === "uncooked"
            ? !recipe.is_cooked
            : true;
    return matchesQuery && matchesFilter;
  });

  return (
    <>
      <PageHeader title="Recipes" />

      <details className="rounded-2xl bg-card p-4 shadow-card">
        <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">+ Add recipe</summary>
        <div className="mt-4">
          <RecipeForm />
        </div>
      </details>

      <form className="flex gap-2">
        <Input name="q" placeholder="Search..." defaultValue={params.q ?? ""} className="h-10" />
        {filter !== "all" ? <input type="hidden" name="filter" value={filter} /> : null}
        <Button type="submit" size="icon" aria-label="Search" className="size-10 min-h-10 min-w-10 shrink-0">
          <Search className="size-4" aria-hidden />
        </Button>
      </form>

      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {filters.map((item) => (
          <a
            key={item.value}
            href={item.href}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              filter === item.value ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
            )}
          >
            {item.label}
          </a>
        ))}
      </div>

      <section className="space-y-3">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
        ) : (
          <EmptyState title="No recipes yet" />
        )}
      </section>
    </>
  );
}
