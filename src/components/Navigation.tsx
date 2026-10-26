import React from 'react';
import { Brand, Icon, Notification } from './Visuals';

const navigationItems = [
  { label: 'Inicio', icon: 'Home', href: '#inicio', mobile: true },
  { label: 'Tareas', icon: 'Check', href: '#tareas', mobile: true },
  { label: 'Calendario', icon: 'Calendar', mobile: true },
  { label: 'Materias', icon: 'Book', mobile: false },
  { label: 'Mensajes', icon: 'Message', mobile: true },
  { label: 'Ajustes', icon: 'Settings', mobile: false },
];

function NavItems({ mobile = false }: { mobile?: boolean }) {
  return navigationItems
    .filter(item => !mobile || item.mobile)
    .map(({ label, icon, href }) => {
      const content = <><Icon name={icon} mobile={mobile} /><span>{label}</span></>;
      const isActive = href === '#inicio';

      // Los destinos sin pantalla definida permanecen como referencias visuales.
      return href ? (
        <a
          key={label} href={href}
          className={isActive ? 'nav-item active' : 'nav-item'}
          aria-current={isActive ? 'page' : undefined}
        >
          {content}
        </a>
      ) : (
        <span key={label} className="nav-item" aria-disabled="true">{content}</span>
      );
    });
}

function Profile() {
  return (
    <div className="profile">
      <span className="avatar">AR</span>
      <div><p>Ana Ramírez</p><p>Tercer semestre</p></div>
    </div>
  );
}

export default function Navigation() {
  return (
    <>
      <aside className="sidebar">
        <Brand />
        <nav aria-label="Navegación principal"><NavItems /></nav>
        <Profile />
      </aside>
      <header className="mobile-header"><Brand /><Notification /></header>
      <nav className="bottom-nav" aria-label="Navegación móvil"><NavItems mobile /></nav>
    </>
  );
}
