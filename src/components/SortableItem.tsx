import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CSSProperties, ReactNode } from 'react';

interface SortableItemProps {
  id: string;
  children: (args: {
    dragHandleProps: Record<string, unknown>;
    isDragging: boolean;
  }) => ReactNode;
}

/**
 * Wraps a child in a sortable container. The child renders with its own drag
 * handle (via `dragHandleProps`) to avoid drag conflicts with interactive
 * controls like checkboxes and action buttons.
 */
export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({
        dragHandleProps: { ...attributes, ...listeners },
        isDragging,
      })}
    </div>
  );
}
