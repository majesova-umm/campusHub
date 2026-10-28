'use client';

import { useState } from 'react';
import type { Task } from '../lib/tasks';
import { useTasks } from '../hooks/useTasks';
import { useSubjects } from '../hooks/useSubjects';
import TaskForm from './TaskForm';
import { TaskCard } from './Tasks';
import { SubjectCard, SubjectForm, SubjectSelect } from './Subjects';

export default function SubjectsClient({ initialTasks }: { initialTasks: Task[] }) {
  const { tasks, isReady: tasksReady, addTask, editTask, deleteTask, setTaskSubject, replaceSubject } = useTasks(initialTasks);
  const { subjects, summaries, createSubject, editSubject, deleteSubject, isReady: subjectsReady } = useSubjects(tasks, replaceSubject);
  const [choice, setChoice] = useState('');
  const isReady = tasksReady && subjectsReady;

  // Si la materia elegida se renombra o elimina, se muestra la primera disponible.
  const selected = subjects.includes(choice) ? choice : subjects[0] ?? '';
  const related = tasks.filter(task => task.subject === selected);
  const unassigned = tasks.filter(task => !task.subject);

  function rename(from: string, to: string) {
    editSubject(from, to);
    if (from === selected) setChoice(to.trim());
  }

  return (
    <main className="main" data-tasks-ready={isReady}>
      <h1>Materias</h1>
      <p className="muted">Agrupa tus tareas por materia y revisa lo pendiente de cada una.</p>
      {!isReady ? <p role="status">Cargando materias…</p> : <>
        <section className="panel subjects-panel" aria-labelledby="subjects-title">
          <div className="tasks-heading">
            <h2 id="subjects-title">Mis materias</h2>
            <p>{subjects.length} {subjects.length === 1 ? 'materia' : 'materias'}</p>
          </div>
          <SubjectForm subjects={subjects} onAdd={createSubject} />
          {subjects.length === 0 && <p className="task-empty" role="status">No tienes materias. Agrega tu primera materia.</p>}
          <ul className="task-list">
            {summaries.map(summary => (
              <SubjectCard
                key={summary.name} summary={summary} subjects={subjects} selected={summary.name === selected}
                onSelect={setChoice} onRename={rename} onDelete={deleteSubject}
              />
            ))}
          </ul>
        </section>
        {selected && (
          <section className="panel subjects-panel" aria-labelledby="subject-tasks-title">
            <h2 id="subject-tasks-title">Tareas de {selected}</h2>
            <TaskForm onAdd={title => addTask(title, undefined, selected)} />
            {related.length === 0 && <p className="task-empty" role="status">No hay tareas en esta materia.</p>}
            <ul className="task-list">{related.map(task => <li key={task.id}>
              <ul><TaskCard task={task} onEdit={editTask} onDelete={deleteTask} /></ul>
              <SubjectSelect task={task} subjects={subjects} onChange={setTaskSubject} />
            </li>)}</ul>
          </section>
        )}
        <section className="panel subjects-panel" aria-labelledby="unassigned-title">
          <h2 id="unassigned-title">Tareas sin materia ({unassigned.length})</h2>
          <p className="muted">Asigna una materia para organizar estas tareas.</p>
          {unassigned.length === 0 && <p className="task-empty">Todas las tareas tienen materia.</p>}
          <ul className="task-list">{unassigned.map(task => <li key={task.id} className="calendar-unscheduled subject-unassigned">
            <span>{task.title}</span>
            <SubjectSelect task={task} subjects={subjects} onChange={setTaskSubject} />
          </li>)}</ul>
        </section>
      </>}
    </main>
  );
}
