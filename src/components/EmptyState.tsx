import { motion } from 'framer-motion';
import { ClipboardList, FilterX, Plus } from 'lucide-react';

interface EmptyStateProps {
  variant: 'no-tasks' | 'no-results';
  onPrimaryAction: () => void;
}

export function EmptyState({ variant, onPrimaryAction }: EmptyStateProps) {
  const isNoTasks = variant === 'no-tasks';
  const Icon = isNoTasks ? ClipboardList : FilterX;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="card flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <Icon className="h-10 w-10" strokeWidth={1.6} />
        <span className="absolute -inset-2 -z-10 rounded-3xl bg-accent/10 blur-2xl" />
      </div>
      <h3 className="text-lg font-bold sm:text-xl">
        {isNoTasks ? 'No tasks yet' : 'No tasks match your filters'}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-text-secondary">
        {isNoTasks
          ? 'Create your first task to start organizing your day.'
          : 'Try adjusting your search or removing some filters to see more tasks.'}
      </p>
      <button type="button" onClick={onPrimaryAction} className="btn-primary mt-6">
        {isNoTasks ? (
          <>
            <Plus className="h-4 w-4" /> Create your first task
          </>
        ) : (
          <>
            <FilterX className="h-4 w-4" /> Clear filters
          </>
        )}
      </button>
    </motion.div>
  );
}
