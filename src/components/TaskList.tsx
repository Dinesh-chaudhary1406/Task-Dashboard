import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import type { Task, ViewMode } from '../types';
import { SortableItem } from './SortableItem';
import { TaskCard } from './TaskCard';
import { TaskRow } from './TaskRow';

interface TaskListProps {
  tasks: Task[];
  view: ViewMode;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onReorder: (orderedIds: string[]) => void;
}

const containerVariants = {
  show: {
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 28 } },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.2 } },
} as const;

export function TaskList({
  tasks,
  view,
  onToggle,
  onEdit,
  onDelete,
  onReorder,
}: TaskListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const ids = useMemo(() => tasks.map((t) => t.id), [tasks]);
  const activeTask = activeId ? tasks.find((t) => t.id === activeId) ?? null : null;

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(String(e.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    const next = [...ids];
    const [moved] = next.splice(oldIndex, 1);
    if (moved !== undefined) next.splice(newIndex, 0, moved);
    onReorder(next);
  };

  const handleDragCancel = () => setActiveId(null);

  const strategy =
    view === 'list' ? verticalListSortingStrategy : rectSortingStrategy;

  const wrapperClass =
    view === 'card'
      ? 'grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3'
      : 'flex flex-col gap-2 sm:gap-3';

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={ids} strategy={strategy}>
        <motion.div
          key={view}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={wrapperClass}
        >
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <SortableItem id={task.id}>
                  {({ dragHandleProps, isDragging }) =>
                    view === 'list' ? (
                      <TaskRow
                        task={task}
                        onToggle={onToggle}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        dragHandleProps={dragHandleProps}
                        isDragging={isDragging}
                      />
                    ) : (
                      <TaskCard
                        task={task}
                        onToggle={onToggle}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        dragHandleProps={dragHandleProps}
                        isDragging={isDragging}
                      />
                    )
                  }
                </SortableItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </SortableContext>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.2, 0, 0, 1)' }}>
        {activeTask ? (
          <div className="rotate-[1.5deg]">
            {view === 'list' ? (
              <TaskRow
                task={activeTask}
                onToggle={() => undefined}
                onEdit={() => undefined}
                onDelete={() => undefined}
                isDragging
              />
            ) : (
              <TaskCard
                task={activeTask}
                onToggle={() => undefined}
                onEdit={() => undefined}
                onDelete={() => undefined}
                isDragging
              />
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
