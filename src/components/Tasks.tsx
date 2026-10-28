import type { Task } from '../lib/tasks';
import React, { useState } from 'react';
import { taskTitleMaxLength, validateTaskTitle } from '../lib/tasks';
import TaskForm from './TaskForm';
import { StatusBadge } from './Visuals';

interface TaskActions {
  onEdit: (id: string, changes: Pick<Task, 'title' | 'status'>) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: { task: Task } & TaskActions) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [error, setError] = useState('');

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validateTaskTitle(title);
    setError(message);
    if (message) return;
    onEdit(task.id, { title, status: task.status });
    setEditing(false);
  }

  return (
    <li className="task-card">
      <div className="task-copy">
        {task.subject && <p>{task.subject}</p>}
        <h3>{task.title}</h3>
      </div>
      <StatusBadge status={task.status} />
      {(task.dueDate || task.date) && <p className={`task-date ${task.urgent ? 'urgent' : ''}`}>{task.dueDate || task.date}</p>}
      <div className="task-actions">
        <label>
          <span className="sr-only">Estado de {task.title}</span>
          <select value={task.status} onChange={event => onEdit(task.id, { title: task.title, status: event.target.value as Task['status'] })}>
            <option value="pending">Pendiente</option>
            <option value="progress">En progreso</option>
            <option value="completed">Completada</option>
          </select>
        </label>
        <button type="button" onClick={() => { setTitle(task.title); setError(''); setEditing(true); setConfirming(false); }}>Editar</button>
        <button type="button" onClick={() => { setConfirming(true); setEditing(false); }}>Eliminar</button>
      </div>
      {editing && (
        <form className="task-editor" onSubmit={save}>
          <label htmlFor={`edit-${task.id}`}>Título de la tarea</label>
          <input id={`edit-${task.id}`} value={title} onChange={event => setTitle(event.target.value)} maxLength={taskTitleMaxLength} required autoFocus aria-invalid={Boolean(error)} aria-describedby={error ? `error-${task.id}` : undefined} />
          {error && <p id={`error-${task.id}`} role="alert">{error}</p>}
          <div className="task-actions">
            <button type="submit">Guardar cambios</button>
            <button type="button" onClick={() => setEditing(false)}>Cancelar edición</button>
          </div>
        </form>
      )}
      {confirming && (
        <div className="task-editor">
          <p>¿Eliminar «{task.title}»? Esta acción no se puede deshacer.</p>
          <div className="task-actions">
            <button type="button" onClick={() => onDelete(task.id)}>Confirmar eliminación</button>
            <button type="button" onClick={() => setConfirming(false)} autoFocus>Cancelar eliminación</button>
          </div>
        </div>
      )}
    </li>
  );
}

interface TasksProps extends TaskActions {
  tasks: Task[];
  pending: number;
  onAdd: (title: string) => void;
  isReady: boolean;
  hasQuery: boolean;
}

export default function Tasks({ tasks, pending, onAdd, onEdit, onDelete, isReady, hasQuery }: TasksProps) {
  return (
    <section id="tareas" className="panel tasks-panel" aria-labelledby="tasks-title" aria-busy={!isReady}>
      <div className="tasks-heading">
        <h2 id="tasks-title">Mis tareas</h2>
        <p>{pending} pendientes</p>
      </div>
      <TaskForm onAdd={onAdd} disabled={!isReady} />
      {!isReady ? <p role="status">Cargando tareas…</p> : (
        <>
          {tasks.length === 0 && <p className="task-empty" role="status">{hasQuery ? 'No hay tareas que coincidan con la búsqueda.' : 'No tienes tareas. Agrega tu primera tarea.'}</p>}
          <ul className="task-list">
            {tasks.map(task => <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />)}
          </ul>
        </>
      )}
    </section>
  );
}
