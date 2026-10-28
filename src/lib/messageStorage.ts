import { isConversationList } from './messages.ts';
import type { Conversation } from './messages.ts';

export const messageStorageKey = 'campus-hub-messages-v1';

export function loadConversations(fallback: Conversation[]): Conversation[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(messageStorageKey) ?? 'null');
    return isConversationList(saved) ? saved : fallback;
  } catch {
    // Storage bloqueado o contenido inválido: la aplicación sigue en memoria.
    return fallback;
  }
}

export function saveConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem(messageStorageKey, JSON.stringify(conversations));
  } catch {
    // La persistencia es opcional; no interrumpe el envío de mensajes.
  }
}
