import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { Store } from "@/types/database";

type StoreFilterProps = {
  stores: Store[];
  currentStoreId?: string;
};

export function StoreFilter({ stores, currentStoreId }: StoreFilterProps) {
  return (
    <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-none">
      <Link
        href="/shopping"
        className={cn(
          "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
          !currentStoreId ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
        )}
      >
        All
      </Link>
      {stores.map((store) => (
        <Link
          key={store.id}
          href={`/shopping?store=${store.id}`}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
            currentStoreId === store.id ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
          )}
        >
          {store.name}
        </Link>
      ))}
    </div>
  );
}
