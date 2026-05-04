import { Plus } from "lucide-react";
import { createShoppingItem, updateShoppingItem } from "@/app/(app)/shopping/actions";
import { CancelButton } from "@/components/ui/cancel-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import type { ShoppingItemWithStore } from "@/lib/db/shopping";
import { defaultStoreNames } from "@/lib/utils/stores";
import type { Store } from "@/types/database";

type ShoppingItemFormProps = {
  stores: Store[];
  item?: ShoppingItemWithStore;
  compact?: boolean;
  showCancel?: boolean;
};

export function ShoppingItemForm({ stores, item, compact = false, showCancel = false }: ShoppingItemFormProps) {
  const action = item ? updateShoppingItem : createShoppingItem;
  const datalistId = `store-options-${item?.id ?? "new"}`;
  const storeNames = [
    ...defaultStoreNames,
    ...stores.map((store) => store.name).filter((name) => !defaultStoreNames.includes(name as (typeof defaultStoreNames)[number])),
  ];

  return (
    <form action={action} className="space-y-3">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <Input name="name" placeholder="Item name" defaultValue={item?.name ?? ""} required />
      <div className="grid grid-cols-2 gap-3">
        <Input name="quantity" placeholder="Qty" defaultValue={item?.quantity ?? "1"} />
        <Input name="unit" placeholder="Unit" defaultValue={item?.unit ?? "pc"} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Input
            name="store_name"
            list={datalistId}
            placeholder="Store"
            defaultValue={item?.store?.name ?? ""}
          />
          <datalist id={datalistId}>
            {storeNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>
        <Select name="priority" defaultValue={item?.priority ?? "normal"}>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="low">Low</option>
        </Select>
      </div>
      {!compact ? <Textarea name="note" placeholder="Note" defaultValue={item?.note ?? ""} /> : null}
      <div className="flex justify-end gap-2">
        {item || showCancel ? <CancelButton /> : null}
        {item ? (
          <SubmitButton size="sm">Update</SubmitButton>
        ) : (
          <SubmitButton size="sm">
            <Plus className="size-4" aria-hidden />
            Add
          </SubmitButton>
        )}
      </div>
    </form>
  );
}
