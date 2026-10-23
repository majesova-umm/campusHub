import React from 'react';
import { Brand, Icon, Notification } from './Visuals';
const items = [['Inicio','Home'],['Tareas','Check'],['Calendario','Calendar'],['Materias','Book'],['Mensajes','Message'],['Ajustes','Settings']];
function NavItems({ mobile = false }) {
  return items.filter(([label]) => !mobile || !['Materias','Ajustes'].includes(label)).map(([label, icon]) => {
    const content = <><Icon name={icon} mobile={mobile} /><span>{label}</span></>;
    // Only destinations represented by this screen are links; other views remain reference items.
    return ['Inicio','Tareas'].includes(label)
      ? <a key={label} href={label === 'Inicio' ? '#inicio' : '#tareas'} className={label === 'Inicio' ? 'nav-item active' : 'nav-item'} aria-current={label === 'Inicio' ? 'page' : undefined}>{content}</a>
      : <span key={label} className="nav-item" aria-disabled="true">{content}</span>;
  });
}
export default function Navigation() {
  return <><aside className="sidebar"><Brand /><nav aria-label="Navegación principal"><NavItems /></nav><div className="profile"><span className="avatar">AR</span><div><p>Ana Ramírez</p><p>Tercer semestre</p></div></div></aside><header className="mobile-header"><Brand /><Notification /></header><nav className="bottom-nav" aria-label="Navegación móvil"><NavItems mobile /></nav></>;
}
