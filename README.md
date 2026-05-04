# HomeHub

A household management web app for families. Includes Supabase Auth, shared layout, shopping list, recipe stock, meal planner, and household budget.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth / PostgreSQL / Row Level Security
- `@supabase/supabase-js` / `@supabase/ssr`
- Local UI components (shadcn/ui-inspired)
- `lucide-react` / `date-fns`

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Set your Supabase credentials in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is the Publishable key (`sb_publishable_...`) found in Supabase Dashboard > Project Settings > API Keys.

## Supabase Migration

Using Supabase CLI:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Or paste the contents of `supabase/migrations/0001_initial_schema.sql` into the Supabase SQL Editor.

## Dev Server

```bash
npm run dev
```

Runs at `http://localhost:3000` by default.

## Features

- Email/password authentication
- Redirect to `/login` when unauthenticated
- Mobile-first bottom navigation
- Home summary dashboard
- Shopping list: add, edit, delete, check toggle, store filter
- Meal planner: weekly view, add, edit, delete, recipe linking
- Recipes: add, edit, delete, cooked check, favorites, ingredient management
- Add ingredients to shopping list from recipes/meal planner
- Household budget: add, edit, delete, category management
- Supabase Row Level Security

---

# HomeHub

家庭向けの生活管理Webアプリです。Supabase Auth、共通レイアウト、買い物リスト、レシピストック、献立表、家計簿を実装しています。

## 技術スタック

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth / PostgreSQL / Row Level Security
- `@supabase/supabase-js` / `@supabase/ssr`
- shadcn/ui風のローカルUIコンポーネント
- `lucide-react` / `date-fns`

## セットアップ

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

`.env.local` にSupabaseの値を設定します。

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` には、Supabase Dashboard の `Project Settings` → `API Keys` にある `sb_publishable_...` の Publishable key を設定します。

## Supabase migration

Supabase CLIを使う場合:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

SQLエディタで実行する場合は、`supabase/migrations/0001_initial_schema.sql` の内容をSupabase SQL Editorに貼り付けて実行してください。

## 開発サーバー

```bash
npm run dev
```

標準では `http://localhost:3000` で起動します。

## 実装済み

- メール/パスワード認証
- 未ログイン時の `/login` リダイレクト
- モバイル向け下部ナビゲーション
- ホームサマリー
- 買い物リストの追加、編集、削除、チェック切替、店舗フィルター
- 献立表の週表示、追加、編集、削除、レシピ紐付け
- レシピの追加、編集、削除、作ったチェック、お気に入り、材料管理
- レシピ/献立から材料を買い物リストへ追加
- 家計簿の追加、編集、削除、カテゴリ管理
- Supabase RLS
