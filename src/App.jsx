import React from 'react';
import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import { Notification, Icon } from './components/Visuals';
import { StatCard, ProgressPanel, ActivityPanel } from './components/Dashboard';
import Tasks from './components/Tasks';
const initialTasks = [
  {id:'1',subject:'Diseño de Interfaces',title:'Proyecto final',status:'progress',date:'En 2 días',urgent:true},
  {id:'2',subject:'Estructuras de Datos',title:'Tarea 3',status:'pending',date:'En 4 días'},
  {id:'3',subject:'Matemáticas Discretas',title:'Ejercicios 5 a 8',status:'pending',date:'En 8 días'},
  {id:'4',subject:'Bases de Datos',title:'Práctica de consultas',status:'completed',date:'Entregada ayer'},
];
const storageKey = 'campus-hub-tasks-v1';
function loadTasks() {
  try {const saved=JSON.parse(localStorage.getItem(storageKey));if(Array.isArray(saved) && saved.length && saved.every(t=>typeof t.id==='string' && typeof t.title==='string' && ['pending','progress','completed'].includes(t.status))) return saved;} catch { /* Storage may be unavailable. */ }
  return initialTasks;
}
export default function App() {
  const [tasks,setTasks] = useState(loadTasks);
  const [query,setQuery] = useState('');
  useEffect(()=>{try {localStorage.setItem(storageKey,JSON.stringify(tasks));}catch{/* Tasks remain usable in memory. */}},[tasks]);
  const pending=tasks.filter(t=>t.status!=='completed').length;
  const normalized=query.toLocaleLowerCase('es');
  const visibleTasks=tasks.filter(t=>`${t.title} ${t.subject || ''}`.toLocaleLowerCase('es').includes(normalized));
  return <><Navigation/><main id="inicio" className="main"><header className="page-header"><div className="greeting"><h1>¡Hola, Ana!</h1><p><span className="desktop-only">Martes 20 de octubre · </span>Tienes 2 entregas esta semana.</p></div><div className="header-actions"><label className="search"><Icon name="Search"/><input aria-label="Buscar tareas o materias" placeholder="Buscar tareas o materias" value={query} onChange={e=>setQuery(e.target.value)}/></label><Notification/></div></header><section className="stats" aria-label="Resumen académico"><StatCard label="Tareas pendientes" compactLabel="Pendientes" value={pending} detail="Ver todas →" icon="Check1" link/><StatCard label="Próxima entrega" compactLabel="Próxima" value="2 días" detail="Proyecto final · Diseño de Interfaces" icon="Calendar1" urgent teal/><StatCard label="Promedio general" compactLabel="Promedio" value="8.6" detail="Ver calificaciones →" icon="Star"/></section><div className="dashboard-grid"><Tasks tasks={visibleTasks} pending={pending} onAdd={title=>setTasks(current=>[...current,{id:crypto.randomUUID(),title,status:'pending'}])}/><ProgressPanel/><ActivityPanel/></div></main></>;
}
