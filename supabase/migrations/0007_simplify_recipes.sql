-- Remove description column (redundant with memo)
alter table public.recipes drop column if exists description;

-- Consolidate URL columns: youtube_url + url_1 + url_2 → url_1 + url_2 + url_3
-- First rename existing to temp names to avoid conflicts
alter table public.recipes rename column youtube_url to _old_youtube_url;
alter table public.recipes rename column url_1 to _old_url_1;
alter table public.recipes rename column url_2 to _old_url_2;

-- Create new columns
alter table public.recipes add column url_1 text;
alter table public.recipes add column url_2 text;
alter table public.recipes add column url_3 text;

-- Migrate data: youtube_url → url_1, old url_1 → url_2, old url_2 → url_3
update public.recipes set
  url_1 = _old_youtube_url,
  url_2 = _old_url_1,
  url_3 = _old_url_2;

-- Drop old columns
alter table public.recipes drop column _old_youtube_url;
alter table public.recipes drop column _old_url_1;
alter table public.recipes drop column _old_url_2;
