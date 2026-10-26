import type { Task } from '../lib/tasks';
import React from 'react';
import TaskForm from './TaskForm';
import { StatusBadge } from './Visuals';

export function TaskCard({ task }: { task: Task }) {
  return (
    <li className="task-card">
      <div className="task-copy">
        {task.subject && <p>{task.subject}</p>}
        <h3>{task.title}</h3>
      </div>
      <StatusBadge status={task.status} />
      {task.date && (
        <p className={`task-date ${task.urgent ? 'urgent' : ''}`}>{task.date}</p>
      )}
    </li>
  );
}

interface TasksProps { tasks: Task[]; pending: number; onAdd: (title: string) => void; }

export default function Tasks({ tasks, pending, onAdd }: TasksProps) {
  return (
    <section id="tareas" className="panel tasks-panel" aria-labelledby="tasks-title">
      <div className="tasks-heading">
        <h2 id="tasks-title">Mis tareas</h2>
        <p>{pending} pendientes</p>
      </div>
      <TaskForm onAdd={onAdd} />
      <ul className="task-list">
        {tasks.map(task => <TaskCard key={task.id} task={task} />)}
      </ul>
    </section>
  );
}
