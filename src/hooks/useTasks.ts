'use client';

import { useEffect, useState } from 'react';
import { countPendingTasks, createTask, updateTask, removeTask, scheduleTask } from '../lib/tasks';
import type { Task } from '../lib/tasks';
import { loadTasks, saveTasks } from '../lib/taskStorage';

export function useTasks(initialTasks: Task[]) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // El primer render coincide con el servidor. Leer storage solo tras hidratar.
    setTasks(loadTasks(initialTasks));
    setIsReady(true);
  }, [initialTasks]);

  useEffect(() => {
    // No sobrescribir las tareas existentes con los ejemplos durante la hidratación.
    if (isReady) saveTasks(tasks);
  }, [tasks, isReady]);

  function addTask(title: string, dueDate?: string): void {
    const task = createTask(title, crypto.randomUUID());
    setTasks(currentTasks => scheduleTask([...currentTasks, task], task.id, dueDate ?? ''));
  }

  function editTask(id: string, changes: Pick<Task, 'title' | 'status'>): void {
    setTasks(currentTasks => updateTask(currentTasks, id, changes));
  }

  function deleteTask(id: string): void {
    setTasks(currentTasks => removeTask(currentTasks, id));
  }

  function setTaskDate(id: string, dueDate: string): void {
    setTasks(currentTasks => scheduleTask(currentTasks, id, dueDate));
  }

  return { setTaskDate, tasks, pending: countPendingTasks(tasks), addTask, editTask, deleteTask, isReady };
}
