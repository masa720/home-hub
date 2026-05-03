# HomeHub

HomeHubは、家庭向けの生活管理Webアプリです。Phase 1では、Supabase Auth、共通レイアウト、買い物リスト、レシピストック、献立表を実装しています。家計簿はDB schemaとRLSまで作成済みです。

## 技術スタック

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth / PostgreSQL / Row Level Security
- `@supabase/supabase-js`
- `@supabase/ssr`
- shadcn/ui風のローカルUIコンポーネント
- `lucide-react`
- `date-fns`

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

- メールリンクログイン
- 未ログイン時の `/login` リダイレクト
- モバイル向け下部ナビゲーション
- ホームサマリー
- 買い物リストの追加、編集、削除、チェック切替、店舗フィルター
- 献立表の週表示、追加、編集、削除、レシピ紐付け
- レシピの追加、編集、削除、作ったチェック、お気に入り、材料管理
- レシピ/献立から材料を買い物リストへ追加
- Supabase RLS

## 今後の改善案

- 家計簿画面のPhase 2実装
- PWAアイコンとオフラインキャッシュ
- 家族共有用のhouseholdモデル
- レシピタグとカテゴリ検索
- 買い物リストの並び替えと店舗別まとめ表示
- 為替レート入力の補助
