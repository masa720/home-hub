insert into public.stores (user_id, name, color)
select auth_user.id, store.name, store.color
from auth.users auth_user
cross join (
  values
    ('リカーショップ', '#b7a3cf'),
    ('スーパーストア', '#f4c9b8'),
    ('T&T', '#d6ebc8'),
    ('コストコ', '#eadca9'),
    ('ウォルマート', '#c4ddea'),
    ('ダララマ', '#aac0c8'),
    ('ダイソー', '#d9c7e5'),
    ('シティマーケット', '#c8ad99'),
    ('ロンドンドラッグ', '#e99b9b'),
    ('セーフウェイ', '#f7cbc9'),
    ('Hマート', '#a9c4e6')
) as store(name, color)
on conflict (user_id, name) do update set color = excluded.color;
