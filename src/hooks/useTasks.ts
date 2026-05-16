import { useCallback, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { Task, TaskDraft, TaskFilters } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { useDebounce } from './useDebounce';
import {
  DEFAULT_FILTERS,
  filterTasks,
  sortTasksByOrder,
} from '../utils/taskHelpers';

export const TASKS_STORAGE_KEY = 'taskflow_tasks';

export interface UseTasksReturn {
  tasks: Task[];
  filteredTasks: Task[];
  filters: TaskFilters;
  setFilters: (next: TaskFilters | ((prev: TaskFilters) => TaskFilters)) => void;
  addTask: (draft: TaskDraft) => Task;
  updateTask: (id: string, patch: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (id: string) => void;
  toggleStatus: (id: string) => void;
  reorderTasks: (orderedIds: string[]) => void;
  stats: { total: number; pending: number; completed: number };
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_STORAGE_KEY, []);
  const [filters, setFiltersState] = useState<TaskFilters>(DEFAULT_FILTERS);

  const setFilters = useCallback(
    (next: TaskFilters | ((prev: TaskFilters) => TaskFilters)) => {
      setFiltersState((prev) =>
        typeof next === 'function' ? (next as (p: TaskFilters) => TaskFilters)(prev) : next,
      );
    },
    [],
  );

  const addTask = useCallback(
    (draft: TaskDraft): Task => {
      const created: Task = {
        id: uuid(),
        title: draft.title.trim(),
        description: draft.description.trim(),
        priority: draft.priority,
        dueDate: draft.dueDate,
        status: 'pending',
        createdAt: new Date().toISOString(),
        order: 0,
      };
      setTasks((prev) => {
        const shifted = prev.map((t) => ({ ...t, order: t.order + 1 }));
        return [created, ...shifted];
      });
      return created;
    },
    [setTasks],
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Omit<Task, 'id'>>) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    },
    [setTasks],
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [setTasks],
  );

  const toggleStatus = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' }
            : t,
        ),
      );
    },
    [setTasks],
  );

  const reorderTasks = useCallback(
    (orderedIds: string[]) => {
      setTasks((prev) => {
        const byId = new Map(prev.map((t) => [t.id, t]));
        const reordered: Task[] = [];
        orderedIds.forEach((id, index) => {
          const task = byId.get(id);
          if (task) reordered.push({ ...task, order: index });
        });
        // Append any tasks not present in orderedIds (defensive)
        prev.forEach((t) => {
          if (!orderedIds.includes(t.id)) {
            reordered.push({ ...t, order: reordered.length });
          }
        });
        return reordered;
      });
    },
    [setTasks],
  );

  const debouncedSearch = useDebounce(filters.search, 300);

  const filteredTasks = useMemo(() => {
    const sorted = sortTasksByOrder(tasks);
    return filterTasks(sorted, { ...filters, search: debouncedSearch });
  }, [tasks, filters, debouncedSearch]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    return { total, pending: total - completed, completed };
  }, [tasks]);

  return {
    tasks,
    filteredTasks,
    filters,
    setFilters,
    addTask,
    updateTask,
    deleteTask,
    toggleStatus,
    reorderTasks,
    stats,
  };
}
