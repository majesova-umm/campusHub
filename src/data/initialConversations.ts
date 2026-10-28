import type { Conversation } from '../lib/messages';

export const initialConversations: Conversation[] = [
  {
    id: 'diseno', contact: 'Prof. Laura Méndez', role: 'Diseño de Interfaces',
    messages: [
      { id: 'd1', author: 'contact', text: 'Recuerden subir el prototipo del proyecto final antes del viernes.', sentAt: '2026-10-26T15:30:00.000Z' },
      { id: 'd2', author: 'contact', text: 'Pueden incluir el enlace de Figma en la entrega.', sentAt: '2026-10-26T15:32:00.000Z' },
    ],
  },
  {
    id: 'equipo', contact: 'Equipo de Estructuras de Datos', role: 'Estructuras de Datos',
    messages: [
      { id: 'e1', author: 'me', text: '¿Nos repartimos los ejercicios de la tarea 3?', sentAt: '2026-10-25T18:10:00.000Z' },
      { id: 'e2', author: 'contact', text: 'Sí, yo tomo del 1 al 4.', sentAt: '2026-10-25T18:20:00.000Z', read: true },
    ],
  },
];
