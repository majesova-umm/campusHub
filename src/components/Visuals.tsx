import type { TaskStatus } from '../lib/tasks';
import React from 'react';

export const asset = (name: string, mobile = false) =>
  `/assets/${mobile ? 'mobile' : 'desktop'}-${name}.svg`;

export function Icon({ name, mobile = false }: { name: string; mobile?: boolean }) {
  return <img className="icon" src={asset(`imgIcon${name}`, mobile)} alt="" aria-hidden="true" />;
}

export function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark"><Icon name="Cap" /></span>
      <span>Campus Hub</span>
    </div>
  );
}

export function Notification() {
  return (
    <button className="notification" aria-label="Notificaciones" title="Notificaciones">
      <Icon name="Bell" />
    </button>
  );
}

const states: Record<TaskStatus, { label: string; dot: string; className: string }> = {
  progress: { label: 'En progreso', dot: 'imgEllipse2', className: 'status-progress' },
  pending: { label: 'Pendiente', dot: 'imgEllipse1', className: 'status-pending' },
  completed: { label: 'Completada', dot: 'imgEllipse', className: 'status-completed' },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, dot, className } = states[status];
  return (
    <span className={`status ${className}`}>
      <img src={asset(dot)} alt="" />
      {label}
    </span>
  );
}
