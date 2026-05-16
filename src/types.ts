export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'completed';
export type ViewMode = 'list' | 'card';
export type Theme = 'dark' | 'light';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  status: Status;
  createdAt: string;
  order: number;
}

export interface TaskFilters {
  search: string;
  status: 'all' | Status;
  priority: 'all' | Priority;
}

export type TaskDraft = Omit<Task, 'id' | 'status' | 'createdAt' | 'order'>;
