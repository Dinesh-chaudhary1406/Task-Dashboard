import { motion } from 'framer-motion';
import { Calendar, GripVertical, Pencil, Trash2 } from 'lucide-react';
import type { Task } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { formatDueDate, isOverdue } from '../utils/taskHelpers';

export interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  dragHandleProps?: Record<string, unknown>;
  isDragging?: boolean;
}

export function TaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
  dragHandleProps,
  isDragging,
}: TaskRowProps) {
  const completed = task.status === 'completed';
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <motion.div
      data-testid={`task-row-${task.id}`}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={`card group flex items-center gap-3 p-3 transition-all duration-300 hover:shadow-glow sm:p-4 ${
        completed
          ? 'border-l-4 border-l-success bg-bg-secondary/60 opacity-60'
          : 'border-l-4 border-l-transparent'
      } ${isDragging ? 'shadow-2xl ring-2 ring-accent/60' : ''}`}
    >
      <button
        type="button"
        {...(dragHandleProps ?? {})}
        aria-label="Drag to reorder"
        className="hidden h-7 w-5 shrink-0 cursor-grab items-center justify-center rounded text-text-secondary opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing sm:flex"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <label className="inline-flex shrink-0 cursor-pointer items-center">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(task.id)}
          aria-label={completed ? 'Mark as pending' : 'Mark as completed'}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="flex h-5 w-5 items-center justify-center rounded-md border border-border bg-bg-secondary transition-colors peer-checked:border-success peer-checked:bg-success peer-focus-visible:ring-2 peer-focus-visible:ring-accent"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className={`h-3 w-3 text-white transition-opacity ${completed ? 'opacity-100' : 'opacity-0'}`}
          >
            <path
              d="M5 10l3 3 7-7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </label>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3
            className={`min-w-0 truncate text-sm font-semibold sm:text-base ${
              completed ? 'text-text-secondary line-through' : 'text-text-primary'
            }`}
          >
            {task.title}
          </h3>
          <PriorityBadge priority={task.priority} />
        </div>
        {task.description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-text-secondary sm:text-sm">
            {task.description}
          </p>
        )}
      </div>

      <span
        className={`hidden shrink-0 items-center gap-1 text-xs sm:inline-flex ${
          overdue ? 'text-danger' : 'text-text-secondary'
        }`}
      >
        <Calendar className="h-3.5 w-3.5" />
        {formatDueDate(task.dueDate)}
      </span>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.title}`}
          className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          aria-label={`Delete ${task.title}`}
          className="rounded-lg p-1.5 text-text-secondary hover:bg-danger/10 hover:text-danger"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
