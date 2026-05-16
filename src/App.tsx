import { useCallback, useState } from 'react';
import { ConfirmDialog } from './components/ConfirmDialog';
import { EmptyState } from './components/EmptyState';
import { FilterBar } from './components/FilterBar';
import { FloatingAddButton } from './components/FloatingAddButton';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTasks } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import type { Task, TaskDraft, ViewMode } from './types';
import { DEFAULT_FILTERS, hasActiveFilters } from './utils/taskHelpers';

export const VIEW_STORAGE_KEY = 'taskflow_view';

export default function App() {
  const {
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
  } = useTasks();
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useLocalStorage<ViewMode>(VIEW_STORAGE_KEY, 'card');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null);

  const openCreate = useCallback(() => {
    setEditing(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((task: Task) => {
    setEditing(task);
    setModalOpen(true);
  }, []);

  const handleSubmit = useCallback(
    (draft: TaskDraft) => {
      if (editing) {
        updateTask(editing.id, draft);
      } else {
        addTask(draft);
      }
    },
    [editing, addTask, updateTask],
  );

  const handleDeleteRequest = useCallback((task: Task) => {
    setPendingDelete(task);
  }, []);

  const confirmDelete = useCallback(() => {
    if (pendingDelete) {
      deleteTask(pendingDelete.id);
      setPendingDelete(null);
    }
  }, [pendingDelete, deleteTask]);

  const clearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), [setFilters]);

  const showNoTasks = tasks.length === 0;
  const showNoResults = !showNoTasks && filteredTasks.length === 0;

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header
        view={view}
        onViewChange={setView}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pb-32 sm:pt-8">
        <section className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Your tasks</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Stay on top of what matters. Drag to reorder, click to edit.
            </p>
          </div>

          <StatsBar stats={stats} />

          <FilterBar
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
          />

          {showNoTasks ? (
            <EmptyState variant="no-tasks" onPrimaryAction={openCreate} />
          ) : showNoResults ? (
            <EmptyState
              variant="no-results"
              onPrimaryAction={
                hasActiveFilters(filters) ? clearFilters : openCreate
              }
            />
          ) : (
            <TaskList
              tasks={filteredTasks}
              view={view}
              onToggle={toggleStatus}
              onEdit={openEdit}
              onDelete={handleDeleteRequest}
              onReorder={reorderTasks}
            />
          )}
        </section>
      </main>

      <FloatingAddButton onClick={openCreate} />

      <TaskModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete task?"
        message="Are you sure you want to delete this task? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
