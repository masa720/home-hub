import { Search } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { RecipeAddFab } from "@/components/recipes/recipe-add-fab";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRecipes } from "@/lib/db/recipes";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/server";

type RecipesPageProps = {
  searchParams: Promise<{ q?: string; filter?: string }>;
};

const filters = [
  { href: "/recipes", value: "all", label: "すべて" },
  { href: "/recipes?filter=uncooked", value: "uncooked", label: "未作成" },
  { href: "/recipes?filter=cooked", value: "cooked", label: "作った" },
  { href: "/recipes?filter=favorite", value: "favorite", label: "お気に入り" },
];

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const params = await searchParams;
  const q = params.q?.trim().toLowerCase() ?? "";
  const filter = params.filter ?? "all";
  const supabase = await createClient();
  const recipes = await getRecipes(supabase);
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesQuery = !q || recipe.title.toLowerCase().includes(q) || recipe.memo?.toLowerCase().includes(q);
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
      <PageHeader title="📖 レシピ" />
      <RecipeAddFab />

      <form className="flex gap-2">
        <Input name="q" placeholder="料理名で検索" defaultValue={params.q ?? ""} />
        {filter !== "all" ? <input type="hidden" name="filter" value={filter} /> : null}
        <Button type="submit" size="icon" aria-label="検索">
          <Search className="size-4" aria-hidden />
        </Button>
      </form>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {filters.map((item) => (
          <Button
            key={item.value}
            asChild
            variant="outline"
            size="sm"
            className={cn("shrink-0", filter === item.value && "border-primary bg-primary text-primary-foreground")}
          >
            <a href={item.href}>{item.label}</a>
          </Button>
        ))}
      </div>

      <section className="space-y-3">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
        ) : (
          <EmptyState title="レシピがありません" description="右下の追加ボタンから登録できます。" />
        )}
      </section>
    </>
  );
}
