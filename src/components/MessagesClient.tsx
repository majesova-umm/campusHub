'use client';

import { useEffect, useRef, useState } from 'react';
import type { Conversation } from '../lib/messages';
import { useMessages } from '../hooks/useMessages';
import { ConversationList, ConversationView, NewConversationForm } from './Messages';

export default function MessagesClient({ initialConversations }: { initialConversations: Conversation[] }) {
  const { conversations, unread, startConversation, send, markRead, deleteConversation, isReady } = useMessages(initialConversations);
  const [selectedId, setSelectedId] = useState('');
  const [focusRequest, setFocusRequest] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const selected = conversations.find(conversation => conversation.id === selectedId);

  useEffect(() => {
    // En móvil la conversación queda debajo de la lista; mover el foco la hace visible.
    if (focusRequest > 0) heading.current?.focus();
  }, [focusRequest]);

  function open(id: string) {
    setSelectedId(id);
    markRead(id);
    setFocusRequest(request => request + 1);
  }

  return (
    <main className="main" data-tasks-ready={isReady}>
      <h1>Mensajes</h1>
      <p className="muted">Conversa sobre tus materias. Los mensajes se guardan solo en este navegador y no se envían a otras personas.</p>
      {!isReady ? <p role="status">Cargando mensajes…</p> : (
        <div className="messages-layout">
          <section className="panel" aria-labelledby="conversations-title">
            <div className="tasks-heading messages-heading">
              <h2 id="conversations-title">Conversaciones</h2>
              <p>{unread} sin leer</p>
            </div>
            <NewConversationForm conversations={conversations} onStart={contact => open(startConversation(contact))} />
            {conversations.length === 0 && <p className="task-empty" role="status">No tienes conversaciones. Inicia una nueva.</p>}
            <ConversationList conversations={conversations} selectedId={selectedId} onSelect={open} />
          </section>
          <section className="panel conversation-panel" aria-labelledby={selected ? 'conversation-title' : undefined} aria-label={selected ? undefined : 'Conversación'}>
            {selected
              ? <ConversationView
                  key={selected.id} conversation={selected} headingRef={heading}
                  onSend={text => send(selected.id, text)}
                  onDelete={() => { deleteConversation(selected.id); setSelectedId(''); }}
                />
              : <p className="task-empty">Selecciona una conversación para leer y escribir mensajes.</p>}
          </section>
        </div>
      )}
    </main>
  );
}
