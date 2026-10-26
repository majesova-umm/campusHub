import type { Task } from '../lib/tasks';

export const initialTasks: Task[] = [
  {
    id: '1', subject: 'Diseño de Interfaces', title: 'Proyecto final',
    status: 'progress', date: 'En 2 días', urgent: true,
  },
  {
    id: '2', subject: 'Estructuras de Datos', title: 'Tarea 3',
    status: 'pending', date: 'En 4 días',
  },
  {
    id: '3', subject: 'Matemáticas Discretas', title: 'Ejercicios 5 a 8',
    status: 'pending', date: 'En 8 días',
  },
  {
    id: '4', subject: 'Bases de Datos', title: 'Práctica de consultas',
    status: 'completed', date: 'Entregada ayer',
  },
];
