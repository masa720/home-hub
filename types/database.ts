export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type DbRecord = Record<string, unknown>;

type Table<Row, Insert = Row, Update = Partial<Insert>> = {
  Row: Row & DbRecord;
  Insert: Insert & DbRecord;
  Update: Update & DbRecord;
  Relationships: Relationship[];
};

export type Currency = "CAD";
export type ExpenseType = "expense" | "income";
export type MealType = "lunch" | "dinner";
export type Priority = "low" | "normal" | "high";

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        {
          id: string;
          email: string | null;
          display_name: string | null;
          base_currency: Currency;
          household_id: string;
          created_at: string;
          updated_at: string;
        },
        {
          id: string;
          email?: string | null;
          display_name?: string | null;
          base_currency?: Currency;
          household_id?: string;
          created_at?: string;
          updated_at?: string;
        }
      >;
      stores: Table<
        {
          id: string;
          user_id: string;
          name: string;
          color: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          user_id: string;
          name: string;
          color?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        }
      >;
      shopping_items: Table<
        {
          id: string;
          user_id: string;
          name: string;
          store_id: string | null;
          quantity: string | null;
          unit: string | null;
          note: string | null;
          is_checked: boolean;
          priority: Priority;
          created_at: string;
          updated_at: string;
          checked_at: string | null;
        },
        {
          id?: string;
          user_id: string;
          name: string;
          store_id?: string | null;
          quantity?: string | null;
          unit?: string | null;
          note?: string | null;
          is_checked?: boolean;
          priority?: Priority;
          created_at?: string;
          updated_at?: string;
          checked_at?: string | null;
        }
      >;
      recipes: Table<
        {
          id: string;
          user_id: string;
          title: string;
          url_1: string | null;
          url_2: string | null;
          url_3: string | null;
          memo: string | null;
          is_cooked: boolean;
          is_favorite: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          user_id: string;
          title: string;
          url_1?: string | null;
          url_2?: string | null;
          url_3?: string | null;
          memo?: string | null;
          is_cooked?: boolean;
          is_favorite?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      recipe_tags: Table<{
        id: string;
        user_id: string;
        name: string;
        created_at: string;
      }>;
      recipe_tag_relations: Table<{
        recipe_id: string;
        tag_id: string;
      }>;
      meal_plans: Table<
        {
          id: string;
          user_id: string;
          date: string;
          meal_type: MealType;
          title: string;
          note: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          user_id: string;
          date: string;
          meal_type: MealType;
          title: string;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      expense_categories: Table<
        {
          id: string;
          user_id: string;
          name: string;
          color: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          user_id: string;
          name: string;
          color?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        }
      >;
      expenses: Table<
        {
          id: string;
          user_id: string;
          type: ExpenseType;
          title: string;
          amount: number;
          currency: Currency;
          exchange_rate_to_cad: number;
          amount_cad: number | null;
          category_id: string | null;
          recurring_expense_id: string | null;
          entered_by_name: string | null;
          memo: string | null;
          spent_at: string;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          user_id: string;
          type?: ExpenseType;
          amount: number;
          currency?: Currency;
          exchange_rate_to_cad?: number;
          amount_cad?: number | null;
          category_id?: string | null;
          recurring_expense_id?: string | null;
          entered_by_name?: string | null;
          memo?: string | null;
          spent_at?: string;
          created_at?: string;
          updated_at?: string;
        }
      >;
      recurring_expenses: Table<
        {
          id: string;
          user_id: string;
          type: ExpenseType;
          title: string;
          amount: number;
          currency: Currency;
          exchange_rate_to_cad: number;
          category_id: string | null;
          day_of_month: number;
          start_month: string;
          end_month: string | null;
          memo: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          user_id: string;
          type?: ExpenseType;
          title: string;
          amount: number;
          currency?: Currency;
          exchange_rate_to_cad?: number;
          category_id?: string | null;
          day_of_month?: number;
          start_month?: string;
          end_month?: string | null;
          memo?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
    } & Record<string, Table<DbRecord>>;
    Views: Record<string, never>;
    Functions: {
      verify_household_code: {
        Args: { code: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Store = Database["public"]["Tables"]["stores"]["Row"];
export type ShoppingItem = Database["public"]["Tables"]["shopping_items"]["Row"];
export type Recipe = Database["public"]["Tables"]["recipes"]["Row"];
export type MealPlan = Database["public"]["Tables"]["meal_plans"]["Row"];
export type ExpenseCategory = Database["public"]["Tables"]["expense_categories"]["Row"];
export type Expense = Database["public"]["Tables"]["expenses"]["Row"];
export type RecurringExpense = Database["public"]["Tables"]["recurring_expenses"]["Row"];
