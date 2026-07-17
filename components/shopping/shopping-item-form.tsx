import { Plus } from "lucide-react";
import { createShoppingItem, updateShoppingItem } from "@/app/(app)/shopping/actions";
import { CancelButton } from "@/components/ui/cancel-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import type { ShoppingItemWithStore } from "@/lib/db/shopping";
import type { Store } from "@/types/database";

type ShoppingItemFormProps = {
  stores: Store[];
  item?: ShoppingItemWithStore;
  compact?: boolean;
  showCancel?: boolean;
  createAction?: (formData: FormData) => Promise<void>;
};

export function ShoppingItemForm({
  stores,
  item,
  compact = false,
  showCancel = false,
  createAction,
}: ShoppingItemFormProps) {
  const action = item ? updateShoppingItem : createAction ?? createShoppingItem;

  return (
    <form action={action} className="space-y-3 rounded-lg border bg-card p-4">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <Input name="name" placeholder="商品名" defaultValue={item?.name ?? ""} required />
      <div className="grid grid-cols-2 gap-3">
        <Input name="quantity" placeholder="数量" defaultValue={item?.quantity ?? "1"} />
        <Input name="unit" placeholder="単位" defaultValue={item?.unit ?? "個"} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Select name="store_id" defaultValue={item?.store_id ?? ""}>
          <option value="">店舗なし</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </Select>
        <Select name="priority" defaultValue={item?.priority ?? "normal"}>
          <option value="normal">通常</option>
          <option value="high">優先</option>
          <option value="low">低め</option>
        </Select>
      </div>
      {!compact ? <Textarea name="note" placeholder="メモ" defaultValue={item?.note ?? ""} /> : null}
      <div className="flex justify-end gap-2">
        {item || showCancel ? <CancelButton /> : null}
        {item ? (
          <SubmitButton variant="secondary">更新</SubmitButton>
        ) : (
          <SubmitButton>
            <Plus className="size-4" aria-hidden />
            追加
          </SubmitButton>
        )}
      </div>
    </form>
  );
}
