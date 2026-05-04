"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const PALETTE = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
  "#22c55e", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6",
  "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
  "#f43f5e", "#64748b", "#94a3b8",
];

type SortableItem = {
  id: string;
  name: string;
  color?: string | null;
};

type SortableListProps = {
  items: SortableItem[];
  deleteAction: (formData: FormData) => void;
  reorderAction: (orderedIds: string[]) => Promise<void>;
  updateColorAction?: (id: string, color: string) => Promise<void>;
};

function SortableRow({
  item,
  deleteAction,
  updateColorAction,
}: {
  item: SortableItem;
  deleteAction: (formData: FormData) => void;
  updateColorAction?: (id: string, color: string) => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const [showPalette, setShowPalette] = useState(false);
  const [color, setColor] = useState(item.color ?? "#94a3b8");
  const [, startTransition] = useTransition();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border-b last:border-b-0 ${isDragging ? "z-10 bg-card shadow-lg" : ""}`}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          type="button"
          className="shrink-0 touch-none text-muted-foreground active:text-white"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        {updateColorAction ? (
          <button
            type="button"
            className="size-5 shrink-0 rounded-full border border-white/20"
            style={{ backgroundColor: color }}
            onClick={() => setShowPalette(!showPalette)}
            aria-label="色を変更"
          />
        ) : item.color ? (
          <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
        ) : null}
        <span className="flex-1 truncate text-sm text-white">{item.name}</span>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={item.id} />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="size-8 min-h-8 min-w-8 p-0 text-red-400 hover:text-red-300"
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </form>
      </div>
      {showPalette ? (
        <div className="flex flex-wrap gap-2 px-3 pb-2">
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              className={`size-7 rounded-full border-2 ${color === c ? "border-white" : "border-transparent"}`}
              style={{ backgroundColor: c }}
              onClick={() => {
                setColor(c);
                setShowPalette(false);
                startTransition(async () => {
                  await updateColorAction!(item.id, c);
                });
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function SortableList({ items: initialItems, deleteAction, reorderAction, updateColorAction }: SortableListProps) {
  const [items, setItems] = useState(initialItems);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    startTransition(async () => {
      await reorderAction(newItems.map((item) => item.id));
    });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <SortableRow key={item.id} item={item} deleteAction={deleteAction} updateColorAction={updateColorAction} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
