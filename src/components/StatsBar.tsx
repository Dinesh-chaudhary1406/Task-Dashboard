import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ListTodo } from 'lucide-react';
import type { ComponentType } from 'react';

interface Stats {
  total: number;
  pending: number;
  completed: number;
}

interface StatItem {
  key: keyof Stats;
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  iconClass: string;
}

function AnimatedCount({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="inline-block text-3xl font-bold tabular-nums"
    >
      {value}
    </motion.span>
  );
}

export function StatsBar({ stats }: { stats: Stats }) {
  const items: StatItem[] = [
    {
      key: 'total',
      label: 'Total Tasks',
      value: stats.total,
      icon: ListTodo,
      iconClass: 'bg-accent/15 text-accent',
    },
    {
      key: 'pending',
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      iconClass: 'bg-warning/15 text-warning',
    },
    {
      key: 'completed',
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      iconClass: 'bg-success/15 text-success',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      {items.map(({ key, label, value, icon: Icon, iconClass }) => (
        <div key={key} className="card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">{label}</p>
              <AnimatedCount value={value} />
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
