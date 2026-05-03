import { Plus } from "lucide-react";
import { createShoppingItem, updateShoppingItem } from "@/app/(app)/shopping/actions";
import { CancelButton } from "@/components/ui/cancel-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { defaultStoreNames } from "@/lib/db/shopping";
import type { ShoppingItemWithStore } from "@/lib/db/shopping";
import type { Store } from "@/types/database";

type ShoppingItemFormProps = {
  stores: Store[];
  item?: ShoppingItemWithStore;
  compact?: boolean;
};

export function ShoppingItemForm({ stores, item, compact = false }: ShoppingItemFormProps) {
  const action = item ? updateShoppingItem : createShoppingItem;
  const datalistId = `store-options-${item?.id ?? "new"}`;
  const storeNames = [
    ...defaultStoreNames,
    ...stores.map((store) => store.name).filter((name) => !defaultStoreNames.includes(name as (typeof defaultStoreNames)[number])),
  ];

  return (
    <form action={action} className="space-y-3 rounded-lg border bg-card p-4">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_8rem_6rem]">
        <Input name="name" placeholder="商品名" defaultValue={item?.name ?? ""} required />
        <Input name="quantity" placeholder="数量" defaultValue={item?.quantity ?? "1"} />
        <Input name="unit" placeholder="単位" defaultValue={item?.unit ?? "個"} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Input
            name="store_name"
            list={datalistId}
            placeholder="店舗を選択または入力"
            defaultValue={item?.store?.name ?? ""}
          />
          <datalist id={datalistId}>
            {storeNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>
        <Select name="priority" defaultValue={item?.priority ?? "normal"}>
          <option value="normal">通常</option>
          <option value="high">優先</option>
          <option value="low">低め</option>
        </Select>
      </div>
      {!compact ? <Textarea name="note" placeholder="メモ" defaultValue={item?.note ?? ""} /> : null}
      <div className="flex justify-end gap-2">
        {item ? <CancelButton /> : null}
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
