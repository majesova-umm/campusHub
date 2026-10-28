import React from 'react';
import { asset, Icon } from './Visuals';

interface StatCardProps {
  label: string;
  compactLabel: string;
  value: string | number;
  detail: string;
  icon: string;
  urgent?: boolean;
  teal?: boolean;
  link?: boolean;
}

export function StatCard({ label, compactLabel, value, detail, icon, urgent, teal, link }: StatCardProps) {
  return (
    <article className="stat-card">
      <p className="stat-label">
        <span className="desktop-only">{label}</span>
        <span className="mobile-only">{compactLabel}</span>
      </p>
      <p className={`stat-value ${urgent ? 'urgent' : ''}`}>{value}</p>
      {link ? (
        <a className="stat-detail" href="/tareas">{detail}</a>
      ) : (
        <p className={`stat-detail ${urgent ? 'muted' : ''}`}>{detail}</p>
      )}
      <span className={`stat-icon ${teal ? 'teal' : ''}`}><Icon name={icon} /></span>
    </article>
  );
}

const progressSegments = [
  { className: 'segment-completed', image: 'imgEllipse3' },
  { className: 'segment-progress', image: 'imgEllipse4' },
  { className: 'segment-pending', image: 'imgEllipse5' },
];

const progressLegend = [
  { label: 'Completado', value: '72%', dot: 'imgEllipse6' },
  { label: 'En progreso', value: '20%', dot: 'imgEllipse7' },
  { label: 'Pendiente', value: '8%', dot: 'imgEllipse8' },
];

function Ring() {
  return (
    <div className="ring" role="img" aria-label="72% completado, 20% en progreso, 8% pendiente">
      {progressSegments.map(({ className, image }) => (
        <div key={image} className={`ring-segment ${className}`}>
          <picture>
            <source media="(max-width: 767px)" srcSet={asset(image, true)} />
            <img src={asset(image)} alt="" />
          </picture>
        </div>
      ))}
      <div className="ring-value"><strong>72%</strong><span>completado</span></div>
    </div>
  );
}

export function ProgressPanel() {
  return (
    <section className="panel progress-panel" aria-labelledby="progress-title">
      <h2 id="progress-title">Progreso del semestre</h2>
      <div className="progress-content">
        <Ring />
        <ul className="legend">
          {progressLegend.map(({ label, value, dot }) => (
            <li key={label}>
              <img src={asset(dot)} alt="" />
              <span>{label}</span>
              <strong>{value}</strong>
            </li>
          ))}
        </ul>
      </div>
      <div className="mobile-progress-copy">
        <h2>Progreso del semestre</h2>
        <p>20% en progreso · 8% pendiente</p>
      </div>
    </section>
  );
}

const activities = [
  { icon: 'File', text: 'Subiste «avance.pdf» a Diseño de Interfaces', time: 'Hace 2 horas' },
  { icon: 'Message', text: 'Nuevo comentario en Estructuras de Datos', time: 'Hace 5 horas' },
  { icon: 'Star1', text: 'Nueva calificación en Matemáticas Discretas', time: 'Ayer' },
];

export function ActivityPanel() {
  return (
    <section className="panel activity-panel">
      <h2>Actividades recientes</h2>
      <ul>
        {activities.map(({ icon, text, time }) => (
          <li key={text}>
            <span className="activity-icon"><Icon name={icon} /></span>
            <div><p>{text}</p><p className="muted">{time}</p></div>
          </li>
        ))}
      </ul>
    </section>
  );
}
