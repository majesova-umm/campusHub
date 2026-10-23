import React from 'react';
export const asset = (name, mobile = false) => `/assets/${mobile ? 'mobile' : 'desktop'}-${name}.svg`;
export function Icon({ name, mobile = false }) {
  return <img className="icon" src={asset(`imgIcon${name}`, mobile)} alt="" aria-hidden="true" />;
}
export function Brand() {
  return <div className="brand"><span className="brand-mark"><Icon name="Cap" /></span><span>Campus Hub</span></div>;
}
export function Notification() {
  return <button className="notification" aria-label="Notificaciones" title="Notificaciones"><Icon name="Bell" /></button>;
}
const states = {
  progress: ['En progreso', 'imgEllipse2'],
  pending: ['Pendiente', 'imgEllipse1'],
  completed: ['Completada', 'imgEllipse'],
};
export function StatusBadge({ status }) {
  const [label, dot] = states[status];
  return <span className={`status status-${status}`}><img src={asset(dot)} alt="" />{label}</span>;
}
