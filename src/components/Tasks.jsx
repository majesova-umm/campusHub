import React from 'react';
import { useRef, useState } from 'react';
import { Icon, StatusBadge } from './Visuals';
export function TaskCard({ task }) {
  return <li className="task-card"><div className="task-copy">{task.subject && <p>{task.subject}</p>}<h3>{task.title}</h3></div><StatusBadge status={task.status}/>{task.date && <p className={`task-date ${task.urgent ? 'urgent' : ''}`}>{task.date}</p>}</li>;
}
export default function Tasks({ tasks, pending, onAdd }) {
  const [title,setTitle] = useState('');
  const [announcement,setAnnouncement] = useState('');
  const input = useRef(null);
  function submit(event) {
    event.preventDefault();
    if (!title.trim()) { input.current.setCustomValidity('Escribe el título de la tarea.'); input.current.reportValidity(); return; }
    onAdd(title.trim()); setAnnouncement(`Tarea agregada: ${title.trim()}`); setTitle(''); input.current.focus();
  }
  return <section id="tareas" className="panel tasks-panel" aria-labelledby="tasks-title"><div className="tasks-heading"><h2 id="tasks-title">Mis tareas</h2><p>{pending} pendientes</p></div><form onSubmit={submit}><label htmlFor="new-task">NUEVA TAREA</label><div className="task-form-row"><input ref={input} id="new-task" value={title} onChange={e=>{setTitle(e.target.value);e.target.setCustomValidity('');}} placeholder="Ej. Leer capítulo 4 de Bases de Datos" required maxLength={200}/><button className="add-button" type="submit"><Icon name="Plus"/>Agregar tarea</button></div></form><ul className="task-list">{tasks.map(task=><TaskCard key={task.id} task={task}/>)}</ul><p className="sr-only" role="status">{announcement}</p></section>;
}
