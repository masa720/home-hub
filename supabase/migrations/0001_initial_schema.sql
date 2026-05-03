create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  base_currency text not null default 'CAD' check (base_currency in ('CAD', 'JPY', 'USD')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  youtube_url text,
  url_1 text,
  url_2 text,
  memo text,
  is_cooked boolean not null default false,
  is_favorite boolean not null default false,
  cooked_count integer not null default 0 check (cooked_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  name text not null,
  quantity text,
  unit text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipe_tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table public.recipe_tag_relations (
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  tag_id uuid not null references public.recipe_tags(id) on delete cascade,
  primary key (recipe_id, tag_id)
);

create table public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  meal_type text not null check (meal_type in ('lunch', 'dinner')),
  title text not null,
  recipe_id uuid references public.recipes(id) on delete set null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  store_id uuid references public.stores(id) on delete set null,
  quantity text,
  unit text,
  note text,
  is_checked boolean not null default false,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  recipe_id uuid references public.recipes(id) on delete set null,
  meal_plan_id uuid references public.meal_plans(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  checked_at timestamptz
);

create table public.expense_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'expense' check (type in ('expense', 'income')),
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'CAD' check (currency in ('CAD', 'JPY', 'USD')),
  exchange_rate_to_cad numeric(12,6) not null default 1 check (exchange_rate_to_cad > 0),
  amount_cad numeric(12,2),
  category_id uuid references public.expense_categories(id) on delete set null,
  payment_method_id uuid references public.payment_methods(id) on delete set null,
  store_id uuid references public.stores(id) on delete set null,
  memo text,
  spent_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_checked_at()
returns trigger
language plpgsql
as $$
begin
  if new.is_checked = true and old.is_checked = false then
    new.checked_at = now();
  elsif new.is_checked = false then
    new.checked_at = null;
  end if;
  return new;
end;
$$;

create or replace function public.set_amount_cad()
returns trigger
language plpgsql
as $$
begin
  new.amount_cad = round(new.amount * new.exchange_rate_to_cad, 2);
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger stores_set_updated_at before update on public.stores
  for each row execute function public.set_updated_at();
create trigger shopping_items_set_updated_at before update on public.shopping_items
  for each row execute function public.set_updated_at();
create trigger recipes_set_updated_at before update on public.recipes
  for each row execute function public.set_updated_at();
create trigger recipe_ingredients_set_updated_at before update on public.recipe_ingredients
  for each row execute function public.set_updated_at();
create trigger meal_plans_set_updated_at before update on public.meal_plans
  for each row execute function public.set_updated_at();
create trigger expense_categories_set_updated_at before update on public.expense_categories
  for each row execute function public.set_updated_at();
create trigger payment_methods_set_updated_at before update on public.payment_methods
  for each row execute function public.set_updated_at();
create trigger expenses_set_updated_at before update on public.expenses
  for each row execute function public.set_updated_at();

create trigger shopping_items_set_checked_at before update on public.shopping_items
  for each row execute function public.set_checked_at();
create trigger expenses_set_amount_cad before insert or update on public.expenses
  for each row execute function public.set_amount_cad();

alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.shopping_items enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.recipe_tags enable row level security;
alter table public.recipe_tag_relations enable row level security;
alter table public.meal_plans enable row level security;
alter table public.expense_categories enable row level security;
alter table public.payment_methods enable row level security;
alter table public.expenses enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table
  public.profiles,
  public.stores,
  public.shopping_items,
  public.recipes,
  public.recipe_ingredients,
  public.recipe_tags,
  public.recipe_tag_relations,
  public.meal_plans,
  public.expense_categories,
  public.payment_methods,
  public.expenses
to authenticated;
grant execute on function public.set_updated_at() to authenticated;
grant execute on function public.set_checked_at() to authenticated;
grant execute on function public.set_amount_cad() to authenticated;

create policy "profiles_select_own" on public.profiles for select using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles for insert with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_delete_own" on public.profiles for delete using (id = auth.uid());

create policy "stores_select_own" on public.stores for select using (user_id = auth.uid());
create policy "stores_insert_own" on public.stores for insert with check (user_id = auth.uid());
create policy "stores_update_own" on public.stores for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "stores_delete_own" on public.stores for delete using (user_id = auth.uid());

create policy "shopping_select_own" on public.shopping_items for select using (user_id = auth.uid());
create policy "shopping_insert_own" on public.shopping_items for insert with check (user_id = auth.uid());
create policy "shopping_update_own" on public.shopping_items for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "shopping_delete_own" on public.shopping_items for delete using (user_id = auth.uid());

create policy "recipes_select_own" on public.recipes for select using (user_id = auth.uid());
create policy "recipes_insert_own" on public.recipes for insert with check (user_id = auth.uid());
create policy "recipes_update_own" on public.recipes for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "recipes_delete_own" on public.recipes for delete using (user_id = auth.uid());

create policy "recipe_ingredients_select_own" on public.recipe_ingredients for select
  using (exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = auth.uid()));
create policy "recipe_ingredients_insert_own" on public.recipe_ingredients for insert
  with check (exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = auth.uid()));
create policy "recipe_ingredients_update_own" on public.recipe_ingredients for update
  using (exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = auth.uid()));
create policy "recipe_ingredients_delete_own" on public.recipe_ingredients for delete
  using (exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = auth.uid()));

create policy "recipe_tags_select_own" on public.recipe_tags for select using (user_id = auth.uid());
create policy "recipe_tags_insert_own" on public.recipe_tags for insert with check (user_id = auth.uid());
create policy "recipe_tags_update_own" on public.recipe_tags for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "recipe_tags_delete_own" on public.recipe_tags for delete using (user_id = auth.uid());

create policy "recipe_tag_relations_select_own" on public.recipe_tag_relations for select
  using (exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = auth.uid()));
create policy "recipe_tag_relations_insert_own" on public.recipe_tag_relations for insert
  with check (
    exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = auth.uid())
    and exists (select 1 from public.recipe_tags t where t.id = tag_id and t.user_id = auth.uid())
  );
create policy "recipe_tag_relations_update_own" on public.recipe_tag_relations for update
  using (exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = auth.uid()))
  with check (
    exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = auth.uid())
    and exists (select 1 from public.recipe_tags t where t.id = tag_id and t.user_id = auth.uid())
  );
create policy "recipe_tag_relations_delete_own" on public.recipe_tag_relations for delete
  using (exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = auth.uid()));

create policy "meal_plans_select_own" on public.meal_plans for select using (user_id = auth.uid());
create policy "meal_plans_insert_own" on public.meal_plans for insert with check (user_id = auth.uid());
create policy "meal_plans_update_own" on public.meal_plans for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "meal_plans_delete_own" on public.meal_plans for delete using (user_id = auth.uid());

create policy "expense_categories_select_own" on public.expense_categories for select using (user_id = auth.uid());
create policy "expense_categories_insert_own" on public.expense_categories for insert with check (user_id = auth.uid());
create policy "expense_categories_update_own" on public.expense_categories for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "expense_categories_delete_own" on public.expense_categories for delete using (user_id = auth.uid());

create policy "payment_methods_select_own" on public.payment_methods for select using (user_id = auth.uid());
create policy "payment_methods_insert_own" on public.payment_methods for insert with check (user_id = auth.uid());
create policy "payment_methods_update_own" on public.payment_methods for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "payment_methods_delete_own" on public.payment_methods for delete using (user_id = auth.uid());

create policy "expenses_select_own" on public.expenses for select using (user_id = auth.uid());
create policy "expenses_insert_own" on public.expenses for insert with check (user_id = auth.uid());
create policy "expenses_update_own" on public.expenses for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "expenses_delete_own" on public.expenses for delete using (user_id = auth.uid());

create index stores_user_id_idx on public.stores(user_id);
create index shopping_items_user_checked_idx on public.shopping_items(user_id, is_checked, created_at desc);
create index recipes_user_id_idx on public.recipes(user_id, created_at desc);
create index recipe_ingredients_recipe_id_idx on public.recipe_ingredients(recipe_id);
create index meal_plans_user_date_idx on public.meal_plans(user_id, date);
create index expenses_user_spent_at_idx on public.expenses(user_id, spent_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;

  insert into public.stores (user_id, name, color)
  values
    (new.id, 'リカーショップ', '#b7a3cf'),
    (new.id, 'スーパーストア', '#f4c9b8'),
    (new.id, 'T&T', '#d6ebc8'),
    (new.id, 'コストコ', '#eadca9'),
    (new.id, 'ウォルマート', '#c4ddea'),
    (new.id, 'ダララマ', '#aac0c8'),
    (new.id, 'ダイソー', '#d9c7e5'),
    (new.id, 'シティマーケット', '#c8ad99'),
    (new.id, 'ロンドンドラッグ', '#e99b9b'),
    (new.id, 'セーフウェイ', '#f7cbc9'),
    (new.id, 'Hマート', '#a9c4e6')
  on conflict (user_id, name) do nothing;

  insert into public.expense_categories (user_id, name, color)
  values
    (new.id, '食費', '#34d399'),
    (new.id, '外食', '#fb7185'),
    (new.id, '日用品', '#38bdf8'),
    (new.id, '交通', '#a78bfa'),
    (new.id, '家賃', '#f59e0b'),
    (new.id, 'サブスク', '#60a5fa'),
    (new.id, '子ども用品', '#facc15'),
    (new.id, 'その他', '#94a3b8')
  on conflict (user_id, name) do nothing;

  insert into public.payment_methods (user_id, name)
  values
    (new.id, 'Credit Card'),
    (new.id, 'Debit'),
    (new.id, 'Cash'),
    (new.id, 'Wise'),
    (new.id, 'Japanese Bank'),
    (new.id, 'Canadian Bank')
  on conflict (user_id, name) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
