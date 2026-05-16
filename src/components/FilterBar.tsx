import { Search, X } from 'lucide-react';
import type { Priority, Status, TaskFilters } from '../types';
import { hasActiveFilters } from '../utils/taskHelpers';
import { FilterDropdown } from './FilterDropdown';

interface FilterBarProps {
  filters: TaskFilters;
  onChange: (next: TaskFilters) => void;
  onClear: () => void;
}

const STATUS_OPTIONS: Array<{ value: 'all' | Status; label: string }> = [
  { value: 'all', label: 'All status' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITY_OPTIONS: Array<{ value: 'all' | Priority; label: string }> = [
  { value: 'all', label: 'All priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export function FilterBar({ filters, onChange, onClear }: FilterBarProps) {
  const active = hasActiveFilters(filters);

  return (
    <div className="card overflow-visible p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="search"
            placeholder="Search tasks by title or description…"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="input pl-9"
            aria-label="Search tasks"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown
            value={filters.status}
            options={STATUS_OPTIONS}
            onChange={(status) => onChange({ ...filters, status })}
            ariaLabel="Filter by status"
          />

          <FilterDropdown
            value={filters.priority}
            options={PRIORITY_OPTIONS}
            onChange={(priority) => onChange({ ...filters, priority })}
            ariaLabel="Filter by priority"
          />

          {active && (
            <button
              type="button"
              onClick={onClear}
              className="btn-ghost shrink-0"
              aria-label="Clear filters"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
