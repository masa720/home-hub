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
    (new.id, 'T&T', '#e8f5d9'),
    (new.id, 'ウォルマート', '#e0f2fe'),
    (new.id, 'セーフウェイ', '#fee2e2'),
    (new.id, 'スーパーストア', '#fef3c7'),
    (new.id, 'シティマーケット', '#d7c2b3'),
    (new.id, 'Hマート', '#bfdbfe'),
    (new.id, 'コストコ', '#fef3c7'),
    (new.id, 'ダララマ', '#b5c8d0'),
    (new.id, 'ダイソー', '#eadcf4'),
    (new.id, 'ロンドンドラッグ', '#f2aaa8'),
    (new.id, 'リカーショップ', '#c7b4dc'),
    (new.id, 'その他', '#94a3b8')
  on conflict (user_id, name) do nothing;

  insert into public.expense_categories (user_id, name, color)
  values
    (new.id, '食費', '#22c55e'),
    (new.id, '外食費', '#f97316'),
    (new.id, 'カフェ', '#a16207'),
    (new.id, '日用品', '#06b6d4'),
    (new.id, '交通', '#6366f1'),
    (new.id, 'ガソリン', '#64748b'),
    (new.id, '家賃', '#f59e0b'),
    (new.id, '光熱費', '#eab308'),
    (new.id, '通信費', '#0ea5e9'),
    (new.id, 'サブスク', '#8b5cf6'),
    (new.id, '医療費', '#ef4444'),
    (new.id, '保険', '#14b8a6'),
    (new.id, '美容', '#ec4899'),
    (new.id, '衣服', '#a855f7'),
    (new.id, '子ども用品', '#84cc16'),
    (new.id, '教育', '#3b82f6'),
    (new.id, '交際費', '#f43f5e'),
    (new.id, '娯楽', '#d946ef'),
    (new.id, '旅行', '#10b981'),
    (new.id, '税金', '#475569'),
    (new.id, '雑費', '#94a3b8'),
    (new.id, '給与', '#2563eb'),
    (new.id, '副業', '#0891b2'),
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

insert into public.expense_categories (user_id, name, color)
select users.id, categories.name, categories.color
from auth.users
cross join (
  values
    ('カフェ', '#a16207'),
    ('ガソリン', '#64748b'),
    ('光熱費', '#eab308'),
    ('通信費', '#0ea5e9'),
    ('医療費', '#ef4444'),
    ('保険', '#14b8a6'),
    ('美容', '#ec4899'),
    ('衣服', '#a855f7'),
    ('教育', '#3b82f6'),
    ('交際費', '#f43f5e'),
    ('娯楽', '#d946ef'),
    ('旅行', '#10b981'),
    ('税金', '#475569'),
    ('雑費', '#94a3b8'),
    ('給与', '#2563eb'),
    ('副業', '#0891b2')
) as categories(name, color)
on conflict (user_id, name) do nothing;
