-- Add sort_order to stores and expense_categories for custom ordering
alter table public.stores
  add column sort_order integer not null default 0;

alter table public.expense_categories
  add column sort_order integer not null default 0;

-- Initialize sort_order for existing stores based on default order
do $$
declare
  store_names text[] := ARRAY[
    'リカーショップ','スーパーストア','T&T','コストコ','ウォルマート',
    'ダララマ','ダイソー','シティマーケット','ロンドンドラッグ','セーフウェイ',
    'Hマート','その他'
  ];
  i integer;
begin
  for i in 1..array_length(store_names, 1) loop
    update public.stores set sort_order = i where name = store_names[i];
  end loop;
  -- Set remaining stores to high sort_order
  update public.stores set sort_order = 999 where sort_order = 0;
end $$;

-- Initialize sort_order for existing expense categories
do $$
declare
  cat_names text[] := ARRAY[
    '食費','外食費','カフェ','日用品','交通','ガソリン','家賃','光熱費',
    '通信費','サブスク','医療費','保険','美容','衣服','子ども用品','教育',
    '交際費','娯楽','旅行','税金','雑費','給与','副業','その他'
  ];
  i integer;
begin
  for i in 1..array_length(cat_names, 1) loop
    update public.expense_categories set sort_order = i where name = cat_names[i];
  end loop;
  update public.expense_categories set sort_order = 999 where sort_order = 0;
end $$;
