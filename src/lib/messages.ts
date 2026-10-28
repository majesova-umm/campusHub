export type MessageAuthor = 'me' | 'contact';

export interface Message {
  id: string;
  author: MessageAuthor;
  text: string;
  sentAt: string;
  read?: boolean;
}

export interface Conversation {
  id: string;
  contact: string;
  role?: string;
  messages: Message[];
}

export const messageTextMaxLength = 1000;
export const contactNameMaxLength = 80;

function isNonEmptyString(value: unknown, maxLength: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function hasUniqueIds(items: { id: string }[]): boolean {
  return new Set(items.map(item => item.id)).size === items.length;
}

export function isMessage(value: unknown): value is Message {
  if (typeof value !== 'object' || value === null) return false;
  const message = value as Record<string, unknown>;
  return (
    isNonEmptyString(message.id, Infinity) &&
    (message.author === 'me' || message.author === 'contact') &&
    isNonEmptyString(message.text, messageTextMaxLength) &&
    typeof message.sentAt === 'string' && Number.isFinite(Date.parse(message.sentAt)) &&
    (message.read === undefined || typeof message.read === 'boolean')
  );
}

export function isConversation(value: unknown): value is Conversation {
  if (typeof value !== 'object' || value === null) return false;
  const conversation = value as Record<string, unknown>;
  return (
    isNonEmptyString(conversation.id, Infinity) &&
    isNonEmptyString(conversation.contact, contactNameMaxLength) &&
    (conversation.role === undefined || typeof conversation.role === 'string') &&
    Array.isArray(conversation.messages) && conversation.messages.every(isMessage) &&
    hasUniqueIds(conversation.messages)
  );
}

export function isConversationList(value: unknown): value is Conversation[] {
  return Array.isArray(value) && value.every(isConversation) && hasUniqueIds(value);
}

export function validateMessageText(text: string): string {
  if (!text.trim()) return 'Escribe un mensaje.';
  if (text.length > messageTextMaxLength) {
    return `El mensaje debe tener como máximo ${messageTextMaxLength} caracteres.`;
  }
  return '';
}

export function validateContactName(name: string, conversations: Conversation[]): string {
  const trimmed = name.trim();
  if (!trimmed) return 'Escribe el nombre del contacto.';
  if (trimmed.length > contactNameMaxLength) {
    return `El nombre debe tener como máximo ${contactNameMaxLength} caracteres.`;
  }
  const normalized = trimmed.toLocaleLowerCase('es');
  if (conversations.some(conversation => conversation.contact.toLocaleLowerCase('es') === normalized)) {
    return 'Ya tienes una conversación con ese contacto.';
  }
  return '';
}

export function countUnread(conversation: Conversation): number {
  return conversation.messages.filter(message => message.author === 'contact' && !message.read).length;
}

export function countAllUnread(conversations: Conversation[]): number {
  return conversations.reduce((total, conversation) => total + countUnread(conversation), 0);
}

export function createConversation(conversations: Conversation[], contact: string, id: string): Conversation[] {
  const error = validateContactName(contact, conversations);
  if (error) throw new Error(error);
  return [{ id, contact: contact.trim(), messages: [] }, ...conversations];
}

// El mensaje enviado lleva la conversación al inicio de la lista.
export function sendMessage(conversations: Conversation[], conversationId: string, text: string, id: string, sentAt: string): Conversation[] {
  const error = validateMessageText(text);
  if (error) throw new Error(error);
  const target = conversations.find(conversation => conversation.id === conversationId);
  if (!target) throw new Error('La conversación ya no existe.');
  const message: Message = { id, author: 'me', text: text.trim(), sentAt };
  return [
    { ...target, messages: [...target.messages, message] },
    ...conversations.filter(conversation => conversation.id !== conversationId),
  ];
}

export function markConversationRead(conversations: Conversation[], conversationId: string): Conversation[] {
  return conversations.map(conversation => {
    if (conversation.id !== conversationId || countUnread(conversation) === 0) return conversation;
    return {
      ...conversation,
      messages: conversation.messages.map(message => message.author === 'contact' ? { ...message, read: true } : message),
    };
  });
}

export function removeConversation(conversations: Conversation[], conversationId: string): Conversation[] {
  return conversations.filter(conversation => conversation.id !== conversationId);
}
