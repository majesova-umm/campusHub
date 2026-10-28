import React from 'react';
import { Brand, Icon, Notification } from './Visuals';

const navigationItems = [
  { label: 'Inicio', icon: 'Home', href: '/', mobile: true },
  { label: 'Tareas', icon: 'Check', href: '/tareas', mobile: true },
  { label: 'Calendario', icon: 'Calendar', href: '/calendario', mobile: true },
  { label: 'Materias', icon: 'Book', href: '/materias', mobile: false },
  { label: 'Mensajes', icon: 'Message', href: '/mensajes', mobile: true },
  { label: 'Ajustes', icon: 'Settings', mobile: false },
];

function NavItems({ mobile = false, activePath }: { mobile?: boolean; activePath: string }) {
  return navigationItems
    .filter(item => !mobile || item.mobile)
    .map(({ label, icon, href }) => {
      const content = <><Icon name={icon} mobile={mobile} /><span>{label}</span></>;
      const isActive = href === activePath;

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

export default function Navigation({ activePath = '/' }: { activePath?: string }) {
  return (
    <>
      <aside className="sidebar">
        <Brand />
        <nav aria-label="Navegación principal"><NavItems activePath={activePath} /></nav>
        <Profile />
      </aside>
      <header className="mobile-header"><Brand /><Notification /></header>
      <nav className="bottom-nav" aria-label="Navegación móvil"><NavItems mobile activePath={activePath} /></nav>
    </>
  );
}
