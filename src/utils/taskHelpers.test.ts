import type { Task } from '../types';
import { DEFAULT_FILTERS, filterTasks, sortTasksByOrder } from './taskHelpers';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'id-' + Math.random().toString(36).slice(2),
    title: 'Untitled',
    description: '',
    priority: 'medium',
    dueDate: '2026-12-31',
    status: 'pending',
    createdAt: new Date('2026-01-01T00:00:00Z').toISOString(),
    order: 0,
    ...overrides,
  };
}

describe('sortTasksByOrder', () => {
  it('sorts ascending by order field', () => {
    const tasks = [
      makeTask({ id: 'b', order: 2 }),
      makeTask({ id: 'a', order: 0 }),
      makeTask({ id: 'c', order: 1 }),
    ];
    expect(sortTasksByOrder(tasks).map((t) => t.id)).toEqual(['a', 'c', 'b']);
  });

  it('does not mutate the input array', () => {
    const tasks = [makeTask({ order: 1 }), makeTask({ order: 0 })];
    const snapshot = [...tasks];
    sortTasksByOrder(tasks);
    expect(tasks).toEqual(snapshot);
  });

  it('breaks ties by createdAt', () => {
    const tasks = [
      makeTask({ id: 'late', order: 0, createdAt: '2026-02-01T00:00:00Z' }),
      makeTask({ id: 'early', order: 0, createdAt: '2026-01-01T00:00:00Z' }),
    ];
    expect(sortTasksByOrder(tasks).map((t) => t.id)).toEqual(['early', 'late']);
  });
});

describe('filterTasks', () => {
  const tasks: Task[] = [
    makeTask({ id: '1', title: 'Buy groceries', description: 'Milk and bread', priority: 'low', status: 'pending' }),
    makeTask({ id: '2', title: 'Ship release', description: 'Tag v1.0', priority: 'high', status: 'pending' }),
    makeTask({ id: '3', title: 'Read book', description: 'Finish chapter 3', priority: 'medium', status: 'completed' }),
    makeTask({ id: '4', title: 'Call dentist', description: 'Book appointment', priority: 'medium', status: 'pending' }),
  ];

  it('filters by title (case-insensitive)', () => {
    const result = filterTasks(tasks, { ...DEFAULT_FILTERS, search: 'ship' });
    expect(result.map((t) => t.id)).toEqual(['2']);
  });

  it('filters by description (case-insensitive)', () => {
    const result = filterTasks(tasks, { ...DEFAULT_FILTERS, search: 'BREAD' });
    expect(result.map((t) => t.id)).toEqual(['1']);
  });

  it('filters by status', () => {
    const result = filterTasks(tasks, { ...DEFAULT_FILTERS, status: 'completed' });
    expect(result.map((t) => t.id)).toEqual(['3']);
  });

  it('filters by priority', () => {
    const result = filterTasks(tasks, { ...DEFAULT_FILTERS, priority: 'medium' });
    expect(result.map((t) => t.id)).toEqual(['3', '4']);
  });

  it('combines all filters with AND logic', () => {
    const result = filterTasks(tasks, {
      search: 'a',
      status: 'pending',
      priority: 'medium',
    });
    expect(result.map((t) => t.id)).toEqual(['4']);
  });

  it('returns all tasks with default filters', () => {
    const result = filterTasks(tasks, DEFAULT_FILTERS);
    expect(result).toHaveLength(tasks.length);
  });
});
