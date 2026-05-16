import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Task } from '../types';
import { TaskCard } from './TaskCard';

const baseTask: Task = {
  id: 'task-1',
  title: 'Write unit tests',
  description: 'Cover the TaskCard component fully',
  priority: 'high',
  dueDate: '2026-06-30',
  status: 'pending',
  createdAt: new Date('2026-01-01T00:00:00Z').toISOString(),
  order: 0,
};

describe('TaskCard', () => {
  it('renders title, description, priority and due date', () => {
    render(
      <TaskCard
        task={baseTask}
        onToggle={() => undefined}
        onEdit={() => undefined}
        onDelete={() => undefined}
      />,
    );

    expect(screen.getByText('Write unit tests')).toBeInTheDocument();
    expect(
      screen.getByText('Cover the TaskCard component fully'),
    ).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });

  it('checkbox calls onToggle with the task id', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(
      <TaskCard
        task={baseTask}
        onToggle={onToggle}
        onEdit={() => undefined}
        onDelete={() => undefined}
      />,
    );

    await user.click(screen.getByLabelText(/mark as completed/i));
    expect(onToggle).toHaveBeenCalledWith('task-1');
  });

  it('delete button calls onDelete with the task', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();
    render(
      <TaskCard
        task={baseTask}
        onToggle={() => undefined}
        onEdit={() => undefined}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByLabelText(/delete write unit tests/i));
    expect(onDelete).toHaveBeenCalledWith(baseTask);
  });

  it('edit button calls onEdit with the task', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    render(
      <TaskCard
        task={baseTask}
        onToggle={() => undefined}
        onEdit={onEdit}
        onDelete={() => undefined}
      />,
    );

    await user.click(screen.getByLabelText(/edit write unit tests/i));
    expect(onEdit).toHaveBeenCalledWith(baseTask);
  });

  it('applies completed styling when status is completed', () => {
    render(
      <TaskCard
        task={{ ...baseTask, status: 'completed' }}
        onToggle={() => undefined}
        onEdit={() => undefined}
        onDelete={() => undefined}
      />,
    );
    const title = screen.getByText('Write unit tests');
    expect(title.className).toMatch(/line-through/);
  });
});
