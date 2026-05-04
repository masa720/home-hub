-- Update handle_new_user to set display_name as null so the setup flow triggers
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, null)
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
