'use client';

import { useEffect, useState } from 'react';
import type { Task } from '../lib/tasks';
import { dateKey, monthDays } from '../lib/calendar';
import { useTasks } from '../hooks/useTasks';
import TaskForm from './TaskForm';
import { TaskCard } from './Tasks';

export default function CalendarClient({ initialTasks }: { initialTasks: Task[] }) {
  const { tasks, isReady, addTask, editTask, deleteTask, setTaskDate } = useTasks(initialTasks);
  const [selected, setSelected] = useState('');
  const [month, setMonth] = useState('');
  const [today, setToday] = useState('');
  useEffect(() => {
    const current = dateKey(new Date());
    setToday(current); setSelected(current); setMonth(current.slice(0, 7));
  }, []);

  function moveMonth(offset: number) {
    const date = new Date(`${month}-01T12:00:00`);
    date.setMonth(date.getMonth() + offset);
    setMonth(dateKey(date).slice(0, 7));
  }

  const visibleDate = month ? new Date(`${month}-01T12:00:00`) : null;
  const scheduled = tasks.filter(task => task.dueDate === selected);
  const unscheduled = tasks.filter(task => !task.dueDate);
  return (
    <main className="main" data-tasks-ready={isReady}>
      <h1>Calendario</h1>
      <p className="muted">Planea las fechas de entrega de tus tareas.</p>
      {!isReady || !visibleDate ? <p role="status">Cargando calendario…</p> : <>
        <section className="panel calendar-panel" aria-label="Calendario mensual">
          <div className="calendar-toolbar task-actions">
            <button onClick={() => moveMonth(-1)} aria-label="Mes anterior">←</button>
            <h2 aria-live="polite">{visibleDate.toLocaleDateString('es', { month: 'long', year: 'numeric' })}</h2>
            <button onClick={() => moveMonth(1)} aria-label="Mes siguiente">→</button>
            <button onClick={() => { setSelected(today); setMonth(today.slice(0, 7)); }}>Hoy</button>
          </div>
          <div className="calendar-grid">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => <span className="calendar-weekday" key={day}>{day}</span>)}
            {monthDays(visibleDate.getFullYear(), visibleDate.getMonth()).map((day, index) => {
              if (!day) return <span key={`empty-${index}`} />;
              const count = tasks.filter(task => task.dueDate === day).length;
              return <button key={day} className={selected === day ? 'calendar-day selected' : 'calendar-day'} aria-pressed={selected === day} aria-current={day === today ? 'date' : undefined} aria-label={`${day}, ${count} tareas`} onClick={() => setSelected(day)}>
                <span>{Number(day.slice(-2))}</span>{count > 0 && <small>{count}<span className="desktop-only"> tareas</span></small>}
              </button>;
            })}
          </div>
        </section>
        <section className="panel calendar-panel" aria-labelledby="day-title">
          <h2 id="day-title">Entregas del {selected}</h2>
          <TaskForm onAdd={title => addTask(title, selected)} />
          {scheduled.length === 0 && <p className="task-empty" role="status">No hay tareas para este día.</p>}
          <ul className="task-list">{scheduled.map(task => <li key={task.id}>
            <ul><TaskCard task={task} onEdit={editTask} onDelete={deleteTask} /></ul>
            <label className="calendar-date-label">Fecha de entrega de {task.title}<input type="date" value={task.dueDate ?? ''} onChange={event => setTaskDate(task.id, event.target.value)} /></label>
          </li>)}</ul>
        </section>
        <section className="panel calendar-panel" aria-labelledby="unscheduled-title">
          <h2 id="unscheduled-title">Tareas sin fecha ({unscheduled.length})</h2>
          <p className="muted">Asigna una fecha de entrega para ver estas tareas en el calendario.</p>
          {unscheduled.length === 0 && <p className="task-empty">Todas las tareas tienen fecha.</p>}
          <ul className="task-list">{unscheduled.map(task => <li key={task.id} className="calendar-unscheduled">
            <span>{task.title}</span>
            <label className="calendar-date-label">Fecha de entrega de {task.title}<input type="date" onChange={event => setTaskDate(task.id, event.target.value)} /></label>
          </li>)}</ul>
        </section>
      </>}
    </main>
  );
}
