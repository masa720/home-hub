update public.profiles
set base_currency = 'CAD',
    updated_at = now()
where base_currency <> 'CAD';

update public.expenses
set amount = coalesce(amount_cad, round(amount * exchange_rate_to_cad, 2), amount),
    currency = 'CAD',
    exchange_rate_to_cad = 1,
    amount_cad = coalesce(amount_cad, round(amount * exchange_rate_to_cad, 2), amount),
    updated_at = now()
where currency <> 'CAD' or exchange_rate_to_cad <> 1 or amount_cad is null;

alter table public.profiles
  drop constraint if exists profiles_base_currency_check;

alter table public.profiles
  add constraint profiles_base_currency_check check (base_currency = 'CAD');

alter table public.expenses
  drop constraint if exists expenses_currency_check;

alter table public.expenses
  add constraint expenses_currency_check check (currency = 'CAD');

alter table public.expenses
  drop constraint if exists expenses_exchange_rate_to_cad_check;

alter table public.expenses
  add constraint expenses_exchange_rate_to_cad_check check (exchange_rate_to_cad = 1);
