'use client';

import React from 'react';
import { Icon, Notification } from './Visuals';

interface PageHeaderProps { query: string; onQueryChange: (query: string) => void; }

export default function PageHeader({ query, onQueryChange }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="greeting">
        <h1>¡Hola, Ana!</h1>
        <p>
          <span className="desktop-only">Martes 20 de octubre · </span>
          Tienes 2 entregas esta semana.
        </p>
      </div>
      <div className="header-actions">
        <label className="search">
          <Icon name="Search" />
          <input
            aria-label="Buscar tareas o materias"
            placeholder="Buscar tareas o materias"
            value={query}
            onChange={event => onQueryChange(event.target.value)}
          />
        </label>
        <Notification />
      </div>
    </header>
  );
}
