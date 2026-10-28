import React, { useState } from 'react';
import type { Task } from '../lib/tasks';
import type { SubjectSummary } from '../lib/subjects';
import { subjectNameMaxLength, validateSubjectName } from '../lib/subjects';
import { Icon } from './Visuals';

interface SubjectFormProps { subjects: string[]; onAdd: (name: string) => void; }

export function SubjectForm({ subjects, onAdd }: SubjectFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validateSubjectName(name, subjects);
    setError(message);
    if (message) return;
    onAdd(name);
    setAnnouncement(`Materia agregada: ${name.trim()}`);
    setName('');
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="new-subject">NUEVA MATERIA</label>
        <div className="task-form-row">
          <input
            id="new-subject" value={name} maxLength={subjectNameMaxLength} required
            placeholder="Ej. Sistemas Operativos"
            aria-invalid={Boolean(error)} aria-describedby={error ? 'new-subject-error' : undefined}
            onChange={event => { setName(event.target.value); setError(''); }}
          />
          <button className="add-button" type="submit"><Icon name="Plus" />Agregar materia</button>
        </div>
        {error && <p id="new-subject-error" className="form-error" role="alert">{error}</p>}
      </form>
      <p className="sr-only" role="status">{announcement}</p>
    </>
  );
}

interface SubjectCardProps {
  summary: SubjectSummary;
  subjects: string[];
  selected: boolean;
  onSelect: (name: string) => void;
  onRename: (from: string, to: string) => void;
  onDelete: (name: string) => void;
}

export function SubjectCard({ summary, subjects, selected, onSelect, onRename, onDelete }: SubjectCardProps) {
  const { name, total, pending } = summary;
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [draft, setDraft] = useState(name);
  const [error, setError] = useState('');
  const id = `subject-${subjects.indexOf(name)}`;

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validateSubjectName(draft, subjects, name);
    setError(message);
    if (message) return;
    onRename(name, draft);
    setEditing(false);
  }

  return (
    <li className={selected ? 'subject-card selected' : 'subject-card'}>
      <div className="task-copy">
        <h3>{name}</h3>
        <p>{total} {total === 1 ? 'tarea' : 'tareas'} · {pending} {pending === 1 ? 'pendiente' : 'pendientes'}</p>
      </div>
      <div className="task-actions">
        <button type="button" aria-pressed={selected} onClick={() => onSelect(name)}>Ver tareas<span className="sr-only"> de {name}</span></button>
        <button type="button" onClick={() => { setDraft(name); setError(''); setEditing(true); setConfirming(false); }}>Renombrar<span className="sr-only"> {name}</span></button>
        <button type="button" onClick={() => { setConfirming(true); setEditing(false); }}>Eliminar<span className="sr-only"> {name}</span></button>
      </div>
      {editing && (
        <form className="task-editor" onSubmit={save} noValidate>
          <label htmlFor={`${id}-name`}>Nombre de la materia</label>
          <input id={`${id}-name`} value={draft} onChange={event => setDraft(event.target.value)} maxLength={subjectNameMaxLength} required autoFocus aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
          {error && <p id={`${id}-error`} className="form-error" role="alert">{error}</p>}
          <div className="task-actions">
            <button type="submit">Guardar nombre</button>
            <button type="button" onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </form>
      )}
      {confirming && (
        <div className="task-editor">
          <p>
            ¿Eliminar la materia «{name}»?{' '}
            {total > 0 ? `${total} ${total === 1 ? 'tarea quedará' : 'tareas quedarán'} sin materia; no se eliminan.` : 'No tiene tareas asignadas.'}
          </p>
          <div className="task-actions">
            <button type="button" onClick={() => onDelete(name)}>Confirmar eliminación</button>
            <button type="button" onClick={() => setConfirming(false)} autoFocus>Cancelar eliminación</button>
          </div>
        </div>
      )}
    </li>
  );
}

interface SubjectSelectProps { task: Task; subjects: string[]; onChange: (id: string, subject: string) => void; }

export function SubjectSelect({ task, subjects, onChange }: SubjectSelectProps) {
  return (
    <label className="subject-select-label">
      Materia de {task.title}
      <select value={task.subject ?? ''} onChange={event => onChange(task.id, event.target.value)}>
        <option value="">Sin materia</option>
        {subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
      </select>
    </label>
  );
}
