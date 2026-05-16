import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import type { Priority, Task, TaskDraft } from '../types';

interface TaskModalProps {
  open: boolean;
  initial?: Task | null;
  onClose: () => void;
  onSubmit: (draft: TaskDraft) => void;
}

interface FormState {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}

const EMPTY: FormState = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
};

const PRIORITIES: Array<{ value: Priority; label: string; ring: string }> = [
  { value: 'low', label: 'Low', ring: 'data-[selected=true]:bg-priority-low/15 data-[selected=true]:text-priority-low data-[selected=true]:border-priority-low/40' },
  { value: 'medium', label: 'Medium', ring: 'data-[selected=true]:bg-priority-medium/15 data-[selected=true]:text-priority-medium data-[selected=true]:border-priority-medium/40' },
  { value: 'high', label: 'High', ring: 'data-[selected=true]:bg-priority-high/15 data-[selected=true]:text-priority-high data-[selected=true]:border-priority-high/40' },
];

export function TaskModal({ open, initial, onClose, onSubmit }: TaskModalProps) {
  const titleId = useId();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          title: initial.title,
          description: initial.description,
          priority: initial.priority,
          dueDate: initial.dueDate,
        });
      } else {
        setForm(EMPTY);
      }
      setErrors({});
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!form.title.trim()) nextErrors.title = 'Title is required';
    if (!form.dueDate) nextErrors.dueDate = 'Due date is required';
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      dueDate: form.dueDate,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="card relative w-full max-w-lg overflow-hidden rounded-t-2xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 id={titleId} className="text-lg font-bold">
                {initial ? 'Edit task' : 'New task'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="rounded-lg p-1.5 text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              <div>
                <label htmlFor="task-title" className="mb-1.5 block text-sm font-medium">
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  id="task-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="input"
                  placeholder="e.g. Draft Q3 roadmap"
                  autoFocus
                  maxLength={120}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-danger">{errors.title}</p>
                )}
              </div>

              <div>
                <label htmlFor="task-desc" className="mb-1.5 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="task-desc"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="input min-h-[96px] resize-y"
                  placeholder="Add a few details…"
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <span className="mb-1.5 block text-sm font-medium">Priority</span>
                  <div className="grid grid-cols-3 gap-2">
                    {PRIORITIES.map((p) => {
                      const selected = form.priority === p.value;
                      return (
                        <button
                          key={p.value}
                          type="button"
                          data-selected={selected}
                          onClick={() => setForm((f) => ({ ...f, priority: p.value }))}
                          className={`flex w-full items-center justify-center rounded-xl border border-border bg-bg-secondary px-4 py-2 text-center text-sm font-medium text-text-secondary transition-colors hover:text-text-primary ${p.ring}`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="task-due" className="mb-1.5 block text-sm font-medium">
                    Due date <span className="text-danger">*</span>
                  </label>
                  <input
                    id="task-due"
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                    className="input"
                  />
                  {errors.dueDate && (
                    <p className="mt-1 text-xs text-danger">{errors.dueDate}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {initial ? 'Save changes' : 'Create task'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
