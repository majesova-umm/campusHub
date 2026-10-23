import React from 'react';
import { asset, Icon } from './Visuals';
export function StatCard({ label, compactLabel, value, detail, icon, urgent, teal, link }) {
  return <article className="stat-card"><p className="stat-label"><span className="desktop-only">{label}</span><span className="mobile-only">{compactLabel}</span></p><p className={`stat-value ${urgent ? 'urgent' : ''}`}>{value}</p>{link ? <a className="stat-detail" href="#tareas">{detail}</a> : <p className={`stat-detail ${urgent ? 'muted' : ''}`}>{detail}</p>}<span className={`stat-icon ${teal ? 'teal' : ''}`}><Icon name={icon} /></span></article>;
}
function Ring() {
  return <div className="ring" role="img" aria-label="72% completado, 20% en progreso, 8% pendiente"><div className="ring-segment segment-completed"><picture><source media="(max-width: 767px)" srcSet={asset('imgEllipse3', true)} /><img src={asset('imgEllipse3')} alt="" /></picture></div><div className="ring-segment segment-progress"><picture><source media="(max-width: 767px)" srcSet={asset('imgEllipse4', true)} /><img src={asset('imgEllipse4')} alt="" /></picture></div><div className="ring-segment segment-pending"><picture><source media="(max-width: 767px)" srcSet={asset('imgEllipse5', true)} /><img src={asset('imgEllipse5')} alt="" /></picture></div><div className="ring-value"><strong>72%</strong><span>completado</span></div></div>;
}
export function ProgressPanel() {
  return <section className="panel progress-panel" aria-labelledby="progress-title"><h2 id="progress-title">Progreso del semestre</h2><div className="progress-content"><Ring /><ul className="legend">{[['Completado','72%','imgEllipse6'],['En progreso','20%','imgEllipse7'],['Pendiente','8%','imgEllipse8']].map(([label,value,dot])=><li key={label}><img src={asset(dot)} alt=""/><span>{label}</span><strong>{value}</strong></li>)}</ul></div><div className="mobile-progress-copy"><h2>Progreso del semestre</h2><p>20% en progreso · 8% pendiente</p></div></section>;
}
export function ActivityPanel() {
  const activities = [['File','Subiste «avance.pdf» a Diseño de Interfaces','Hace 2 horas'],['Message','Nuevo comentario en Estructuras de Datos','Hace 5 horas'],['Star1','Nueva calificación en Matemáticas Discretas','Ayer']];
  return <section className="panel activity-panel"><h2>Actividades recientes</h2><ul>{activities.map(([icon,text,time])=><li key={text}><span className="activity-icon"><Icon name={icon}/></span><div><p>{text}</p><p className="muted">{time}</p></div></li>)}</ul></section>;
}
