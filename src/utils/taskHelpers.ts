import type { Task, TaskFilters } from '../types';

/**
 * Sort tasks ascending by their `order` field. Stable for equal orders by createdAt.
 */
export function sortTasksByOrder(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.createdAt.localeCompare(b.createdAt);
  });
}

/**
 * Apply search + status + priority filters using AND semantics.
 * Search is case-insensitive and matches title OR description.
 */
export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const q = filters.search.trim().toLowerCase();

  return tasks.filter((task) => {
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }
    if (q.length > 0) {
      const inTitle = task.title.toLowerCase().includes(q);
      const inDesc = task.description.toLowerCase().includes(q);
      if (!inTitle && !inDesc) return false;
    }
    return true;
  });
}

export const DEFAULT_FILTERS: TaskFilters = {
  search: '',
  status: 'all',
  priority: 'all',
};

export function hasActiveFilters(filters: TaskFilters): boolean {
  return (
    filters.search.trim().length > 0 ||
    filters.status !== 'all' ||
    filters.priority !== 'all'
  );
}

export function formatDueDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function isOverdue(iso: string, status: 'pending' | 'completed'): boolean {
  if (status === 'completed') return false;
  if (!iso) return false;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
}
