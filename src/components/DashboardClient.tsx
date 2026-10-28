'use client';

import type { ReactNode } from 'react';
import type { Task } from '../lib/tasks';
import React, { useState } from 'react';
import PageHeader from './PageHeader';
import { StatCard } from './Dashboard';
import Tasks from './Tasks';
import { useTasks } from '../hooks/useTasks';
import { filterTasks } from '../lib/tasks';

interface DashboardClientProps {
  initialTasks: Task[];
  progressPanel: ReactNode;
  activityPanel: ReactNode;
}

export default function DashboardClient({ initialTasks, progressPanel, activityPanel }: DashboardClientProps) {
  const { tasks, pending, addTask, editTask, deleteTask, isReady } = useTasks(initialTasks);
  const [query, setQuery] = useState('');

  return (
    <>
      <main id="inicio" className="main" data-tasks-ready={isReady}>
        <PageHeader query={query} onQueryChange={setQuery} />
        <section className="stats" aria-label="Resumen académico">
          <StatCard
            label="Tareas pendientes" compactLabel="Pendientes" value={pending}
            detail="Ver todas →" icon="Check1" link
          />
          <StatCard
            label="Próxima entrega" compactLabel="Próxima" value="2 días"
            detail="Proyecto final · Diseño de Interfaces" icon="Calendar1" urgent teal
          />
          <StatCard
            label="Promedio general" compactLabel="Promedio" value="8.6"
            detail="Ver calificaciones →" icon="Star"
          />
        </section>
        <div className="dashboard-grid">
          <Tasks tasks={filterTasks(tasks, query)} pending={pending} onAdd={addTask} onEdit={editTask} onDelete={deleteTask} isReady={isReady} hasQuery={Boolean(query.trim())} />
          {progressPanel}
          {activityPanel}
        </div>
      </main>
    </>
  );
}
