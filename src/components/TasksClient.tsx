'use client';

import { useState } from 'react';
import type { Task } from '../lib/tasks';
import { filterTasks } from '../lib/tasks';
import { useTasks } from '../hooks/useTasks';
import Tasks from './Tasks';

export default function TasksClient({ initialTasks }: { initialTasks: Task[] }) {
  const { tasks, pending, addTask, editTask, deleteTask, isReady } = useTasks(initialTasks);
  const [query, setQuery] = useState('');

  return (
    <main className="main" data-tasks-ready={isReady}>
      <h1>Tareas</h1>
      <p className="muted">Organiza y actualiza tus tareas académicas.</p>
      <div className="tasks-search">
        <label htmlFor="tasks-search">Buscar tareas o materias</label>
        <input id="tasks-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar tareas o materias" />
      </div>
      <Tasks tasks={filterTasks(tasks, query)} pending={pending} onAdd={addTask} onEdit={editTask} onDelete={deleteTask} isReady={isReady} hasQuery={Boolean(query)} />
    </main>
  );
}
