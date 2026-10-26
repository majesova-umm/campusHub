import { isTaskList } from './tasks.ts';
import type { Task } from './tasks.ts';

export const taskStorageKey = 'campus-hub-tasks-v1';

export function loadTasks(fallback: Task[]): Task[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(taskStorageKey) ?? 'null');
    return isTaskList(saved) ? saved : fallback;
  } catch {
    // Storage bloqueado o contenido inválido: la aplicación sigue en memoria.
    return fallback;
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(taskStorageKey, JSON.stringify(tasks));
  } catch {
    // La persistencia es opcional; no interrumpe la creación de tareas.
  }
}
