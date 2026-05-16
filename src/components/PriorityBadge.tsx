import type { Priority } from '../types';

const STYLES: Record<Priority, string> = {
  low: 'bg-priority-low/15 text-priority-low',
  medium: 'bg-priority-medium/15 text-priority-medium',
  high: 'bg-priority-high/15 text-priority-high',
};

const LABEL: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`priority-badge ${STYLES[priority]}`}>
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {LABEL[priority]}
    </span>
  );
}
