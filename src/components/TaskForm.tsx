'use client';

import React, { useRef, useState } from 'react';
import { taskTitleMaxLength, validateTaskTitle } from '../lib/tasks';
import { Icon } from './Visuals';

interface TaskFormProps { onAdd: (title: string) => void; }

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const input = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validateTaskTitle(title);
    input.current?.setCustomValidity(error);
    if (error) {
      input.current?.reportValidity();
      return;
    }

    const trimmedTitle = title.trim();
    onAdd(trimmedTitle);
    setAnnouncement(`Tarea agregada: ${trimmedTitle}`);
    setTitle('');
    input.current?.focus();
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-task">NUEVA TAREA</label>
        <div className="task-form-row">
          <input
            ref={input}
            id="new-task"
            value={title}
            onChange={event => {
              setTitle(event.target.value);
              event.target.setCustomValidity('');
            }}
            placeholder="Ej. Leer capítulo 4 de Bases de Datos"
            required
            maxLength={taskTitleMaxLength}
          />
          <button className="add-button" type="submit">
            <Icon name="Plus" />
            Agregar tarea
          </button>
        </div>
      </form>
      <p className="sr-only" role="status">{announcement}</p>
    </>
  );
}
