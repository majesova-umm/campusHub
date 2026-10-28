'use client';

import { useEffect, useState } from 'react';
import { countPendingTasks, createTask, updateTask, removeTask, scheduleTask } from '../lib/tasks';
import type { Task } from '../lib/tasks';
import { assignTaskSubject, replaceTaskSubject } from '../lib/subjects';
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

  function addTask(title: string, dueDate?: string, subject?: string): void {
    const task = createTask(title, crypto.randomUUID());
    setTasks(currentTasks => assignTaskSubject(scheduleTask([...currentTasks, task], task.id, dueDate ?? ''), task.id, subject ?? ''));
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

  function setTaskSubject(id: string, subject: string): void {
    setTasks(currentTasks => assignTaskSubject(currentTasks, id, subject));
  }

  function replaceSubject(from: string, to: string): void {
    setTasks(currentTasks => replaceTaskSubject(currentTasks, from, to));
  }

  return { setTaskDate, setTaskSubject, replaceSubject, tasks, pending: countPendingTasks(tasks), addTask, editTask, deleteTask, isReady };
}
