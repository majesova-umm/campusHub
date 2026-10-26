export type TaskStatus = 'pending' | 'progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  subject?: string;
  date?: string;
  urgent?: boolean;
}

export const taskTitleMaxLength = 200;

export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false;
  const task = value as Record<string, unknown>;
  return (
    typeof task.id === 'string' && task.id.trim().length > 0 &&
    typeof task.title === 'string' && task.title.trim().length > 0 &&
    task.title.length <= taskTitleMaxLength &&
    (task.status === 'pending' || task.status === 'progress' || task.status === 'completed') &&
    (task.subject === undefined || typeof task.subject === 'string') &&
    (task.date === undefined || typeof task.date === 'string') &&
    (task.urgent === undefined || typeof task.urgent === 'boolean')
  );
}

export function isTaskList(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask) &&
    new Set(value.map(task => task.id)).size === value.length;
}

export function validateTaskTitle(title: string): string {
  if (!title.trim()) return 'Escribe el título de la tarea.';
  if (title.length > taskTitleMaxLength) {
    return `El título debe tener como máximo ${taskTitleMaxLength} caracteres.`;
  }
  return '';
}

export function createTask(title: string, id: string): Task {
  const error = validateTaskTitle(title);
  if (error) throw new Error(error);
  return { id, title: title.trim(), status: 'pending' };
}

export function countPendingTasks(tasks: Task[]): number {
  return tasks.filter(task => task.status !== 'completed').length;
}

export function filterTasks(tasks: Task[], query: string): Task[] {
  const normalizedQuery = query.toLocaleLowerCase('es');
  return tasks.filter(task =>
    `${task.title} ${task.subject ?? ''}`.toLocaleLowerCase('es').includes(normalizedQuery),
  );
}
