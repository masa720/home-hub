"use client";

import { useRef, useState, useTransition } from "react";
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
import { ColorPicker } from "@/components/settings/color-picker";
import { Button } from "@/components/ui/button";

type SortableItem = {
  id: string;
  name: string;
  color?: string | null;
};

type SortableListProps = {
  items: SortableItem[];
  showBadgePreview?: boolean;
  deleteAction: (formData: FormData) => void;
  reorderAction: (orderedIds: string[]) => Promise<void>;
  updateColorAction?: (id: string, color: string) => Promise<void>;
};

function SortableRow({
  item,
  isPickerOpen,
  onTogglePicker,
  showBadgePreview,
  onDelete,
  updateColorAction,
}: {
  item: SortableItem;
  isPickerOpen: boolean;
  onTogglePicker: (id: string) => void;
  showBadgePreview?: boolean;
  onDelete: (item: SortableItem) => void;
  updateColorAction?: (id: string, color: string) => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const [color, setColor] = useState(item.color ?? "#94a3b8");
  const [savedColor, setSavedColor] = useState(item.color ?? "#94a3b8");
  const [, startTransition] = useTransition();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleColorChange(newColor: string) {
    setColor(newColor);
  }

  function handleColorConfirm() {
    if (color === savedColor) {
      onTogglePicker(item.id);
      return;
    }
    setSavedColor(color);
    startTransition(async () => {
      await updateColorAction!(item.id, color);
    });
    onTogglePicker(item.id);
  }

  function handleColorCancel() {
    setColor(savedColor);
    onTogglePicker(item.id);
  }

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
            onClick={() => onTogglePicker(item.id)}
            aria-label="色を変更"
          />
        ) : item.color ? (
          <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
        ) : null}
        <span className="flex-1 truncate text-sm text-white">{item.name}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 min-h-8 min-w-8 p-0 text-red-400 hover:text-red-300"
          onClick={() => onDelete(item)}
        >
          <Trash2 className="size-4" aria-hidden />
        </Button>
      </div>
      {isPickerOpen ? (
        <div className="px-3 pb-2">
          <ColorPicker
            value={color}
            name={showBadgePreview ? item.name : undefined}
            onChange={handleColorChange}
          />
          <div className="mt-2 flex gap-2">
            <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={handleColorCancel}>
              キャンセル
            </Button>
            <Button type="button" variant="secondary" size="sm" className="h-7 text-xs" onClick={handleColorConfirm}>
              色を保存
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SortableList({ items: initialItems, showBadgePreview, deleteAction, reorderAction, updateColorAction }: SortableListProps) {
  const [items, setItems] = useState(initialItems);
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<SortableItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  );

  function handleTogglePicker(id: string) {
    setOpenPickerId((prev) => (prev === id ? null : id));
  }

  function handleDeleteClick(item: SortableItem) {
    setDeleteTarget(item);
    dialogRef.current?.showModal();
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    const formData = new FormData();
    formData.append("id", deleteTarget.id);
    deleteAction(formData);
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    dialogRef.current?.close();
    setDeleteTarget(null);
  }

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
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableRow
              key={item.id}
              item={item}
              isPickerOpen={openPickerId === item.id}
              onTogglePicker={handleTogglePicker}
              showBadgePreview={showBadgePreview}
              onDelete={handleDeleteClick}
              updateColorAction={updateColorAction}
            />
          ))}
        </SortableContext>
      </DndContext>
      <dialog
        ref={dialogRef}
        className="rounded-lg border bg-card p-6 text-foreground backdrop:bg-black/50"
        onClick={(e) => { if (e.target === e.currentTarget) dialogRef.current?.close(); }}
      >
        <p className="mb-4 text-sm">
          「{deleteTarget?.name}」を削除しますか？
        </p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => dialogRef.current?.close()}>
            キャンセル
          </Button>
          <Button type="button" variant="danger" size="sm" onClick={handleDeleteConfirm}>
            削除
          </Button>
        </div>
      </dialog>
    </>
  );
}
