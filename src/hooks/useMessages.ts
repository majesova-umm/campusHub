'use client';

import { useEffect, useState } from 'react';
import type { Conversation } from '../lib/messages';
import { countAllUnread, createConversation, markConversationRead, removeConversation, sendMessage } from '../lib/messages';
import { loadConversations, saveConversations } from '../lib/messageStorage';

export function useMessages(initialConversations: Conversation[]) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // El primer render coincide con el servidor. Leer storage solo tras hidratar.
    setConversations(loadConversations(initialConversations));
    setIsReady(true);
  }, [initialConversations]);

  useEffect(() => {
    // No sobrescribir los mensajes guardados con los ejemplos durante la hidratación.
    if (isReady) saveConversations(conversations);
  }, [conversations, isReady]);

  function startConversation(contact: string): string {
    const id = crypto.randomUUID();
    setConversations(createConversation(conversations, contact, id));
    return id;
  }

  function send(conversationId: string, text: string): void {
    setConversations(sendMessage(conversations, conversationId, text, crypto.randomUUID(), new Date().toISOString()));
  }

  function markRead(conversationId: string): void {
    setConversations(current => markConversationRead(current, conversationId));
  }

  function deleteConversation(conversationId: string): void {
    setConversations(current => removeConversation(current, conversationId));
  }

  return { conversations, unread: countAllUnread(conversations), startConversation, send, markRead, deleteConversation, isReady };
}
