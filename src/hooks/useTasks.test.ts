import { act, renderHook } from '@testing-library/react';
import { TASKS_STORAGE_KEY, useTasks } from './useTasks';

beforeEach(() => {
  window.localStorage.clear();
});

describe('useTasks', () => {
  it('addTask creates a pending task with a uuid and prepends to list', () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask({
        title: 'First task',
        description: 'Do the thing',
        priority: 'high',
        dueDate: '2026-12-31',
      });
    });

    expect(result.current.tasks).toHaveLength(1);
    const task = result.current.tasks[0]!;
    expect(task.title).toBe('First task');
    expect(task.status).toBe('pending');
    expect(typeof task.id).toBe('string');
    expect(task.id.length).toBeGreaterThan(0);
    expect(task.createdAt).toBeTruthy();
    expect(result.current.stats).toEqual({ total: 1, pending: 1, completed: 0 });
  });

  it('toggleStatus flips pending -> completed and back', () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask({
        title: 'Toggle me',
        description: '',
        priority: 'low',
        dueDate: '2026-01-01',
      });
    });
    const id = result.current.tasks[0]!.id;

    act(() => result.current.toggleStatus(id));
    expect(result.current.tasks[0]!.status).toBe('completed');
    expect(result.current.stats.completed).toBe(1);

    act(() => result.current.toggleStatus(id));
    expect(result.current.tasks[0]!.status).toBe('pending');
    expect(result.current.stats.pending).toBe(1);
  });

  it('updateTask applies the patch', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask({
        title: 'Old',
        description: 'old desc',
        priority: 'low',
        dueDate: '2026-01-01',
      });
    });
    const id = result.current.tasks[0]!.id;

    act(() =>
      result.current.updateTask(id, {
        title: 'New',
        priority: 'high',
      }),
    );

    const updated = result.current.tasks[0]!;
    expect(updated.title).toBe('New');
    expect(updated.priority).toBe('high');
    expect(updated.description).toBe('old desc');
  });

  it('deleteTask removes the task from state and localStorage', () => {
    const { result } = renderHook(() => useTasks());
    act(() =>
      result.current.addTask({
        title: 'Goner',
        description: '',
        priority: 'low',
        dueDate: '2026-01-01',
      }),
    );
    const id = result.current.tasks[0]!.id;

    act(() => result.current.deleteTask(id));
    expect(result.current.tasks).toHaveLength(0);

    const persisted = window.localStorage.getItem(TASKS_STORAGE_KEY);
    expect(persisted).toBe('[]');
  });
});
