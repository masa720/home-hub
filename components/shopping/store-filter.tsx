import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { Store } from "@/types/database";

type StoreFilterProps = {
  stores: Store[];
  currentStoreId?: string;
};

export function StoreFilter({ stores, currentStoreId }: StoreFilterProps) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      <Link
        href="/shopping"
        className={cn(
          "shrink-0 rounded-full border px-4 py-2 text-sm font-medium text-muted-foreground",
          !currentStoreId && "border-primary bg-primary text-primary-foreground",
        )}
      >
        すべて
      </Link>
      {stores.map((store) => (
        <Link
          key={store.id}
          href={`/shopping?store=${store.id}`}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-medium text-muted-foreground",
            currentStoreId === store.id && "border-primary bg-primary text-primary-foreground",
          )}
        >
          {store.name}
        </Link>
      ))}
    </div>
  );
}
