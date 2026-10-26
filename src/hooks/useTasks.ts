'use client';

import { useEffect, useState } from 'react';
import { countPendingTasks, createTask } from '../lib/tasks';
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

  function addTask(title: string): void {
    const task = createTask(title, crypto.randomUUID());
    setTasks(currentTasks => [...currentTasks, task]);
  }

  return { tasks, pending: countPendingTasks(tasks), addTask, isReady };
}
