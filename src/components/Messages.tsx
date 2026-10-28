import React, { useState } from 'react';
import type { Conversation } from '../lib/messages';
import { contactNameMaxLength, countUnread, messageTextMaxLength, validateContactName, validateMessageText } from '../lib/messages';
import { Icon } from './Visuals';

function formatSentAt(sentAt: string): string {
  return new Date(sentAt).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' });
}

interface NewConversationFormProps { conversations: Conversation[]; onStart: (contact: string) => void; }

export function NewConversationForm({ conversations, onStart }: NewConversationFormProps) {
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validateContactName(contact, conversations);
    setError(message);
    if (message) return;
    onStart(contact);
    setContact('');
  }

  return (
    <form className="new-conversation-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="new-conversation">NUEVA CONVERSACIÓN</label>
      <div className="task-form-row">
        <input
          id="new-conversation" value={contact} maxLength={contactNameMaxLength} required
          placeholder="Nombre del contacto"
          aria-invalid={Boolean(error)} aria-describedby={error ? 'new-conversation-error' : undefined}
          onChange={event => { setContact(event.target.value); setError(''); }}
        />
        <button className="add-button" type="submit"><Icon name="Plus" />Iniciar</button>
      </div>
      {error && <p id="new-conversation-error" className="form-error" role="alert">{error}</p>}
    </form>
  );
}

interface ConversationListProps { conversations: Conversation[]; selectedId: string; onSelect: (id: string) => void; }

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  return (
    <ul className="task-list">
      {conversations.map(conversation => {
        const unread = countUnread(conversation);
        const last = conversation.messages.at(-1);
        const selected = conversation.id === selectedId;
        return (
          <li key={conversation.id}>
            <button type="button" className={selected ? 'conversation-item selected' : 'conversation-item'} aria-pressed={selected} onClick={() => onSelect(conversation.id)}>
              <span className="conversation-contact">{conversation.contact}</span>
              {unread > 0 && <span className="unread-badge">{unread}<span className="sr-only"> sin leer</span></span>}
              {conversation.role && <span className="conversation-meta">{conversation.role}</span>}
              <span className="conversation-preview">{last ? `${last.author === 'me' ? 'Tú: ' : ''}${last.text}` : 'Sin mensajes'}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function MessageForm({ conversation, onSend }: { conversation: Conversation; onSend: (text: string) => void }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');

  function submit() {
    const message = validateMessageText(text);
    setError(message);
    if (message) return;
    onSend(text);
    setAnnouncement(`Mensaje enviado a ${conversation.contact}`);
    setText('');
  }

  return (
    <form className="message-form" onSubmit={event => { event.preventDefault(); submit(); }} noValidate>
      <label htmlFor="new-message">Mensaje para {conversation.contact}</label>
      <div className="task-form-row">
        <textarea
          id="new-message" value={text} maxLength={messageTextMaxLength} rows={2} required
          placeholder="Escribe un mensaje"
          aria-invalid={Boolean(error)} aria-describedby={error ? 'new-message-error' : 'new-message-hint'}
          onChange={event => { setText(event.target.value); setError(''); }}
          onKeyDown={event => {
            // Enter envía; Mayús + Enter agrega un salto de línea.
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              submit();
            }
          }}
        />
        <button className="add-button" type="submit">Enviar</button>
      </div>
      {error
        ? <p id="new-message-error" className="form-error" role="alert">{error}</p>
        : <p id="new-message-hint" className="sr-only">Enter envía; Mayús más Enter agrega un salto de línea.</p>}
      <p className="sr-only" role="status">{announcement}</p>
    </form>
  );
}

interface ConversationViewProps {
  conversation: Conversation;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onSend: (text: string) => void;
  onDelete: () => void;
}

export function ConversationView({ conversation, headingRef, onSend, onDelete }: ConversationViewProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <div className="conversation-heading">
        <div className="task-copy">
          <h2 id="conversation-title" ref={headingRef} tabIndex={-1}>{conversation.contact}</h2>
          {conversation.role && <p>{conversation.role}</p>}
        </div>
        <div className="task-actions conversation-actions">
          <button type="button" onClick={() => setConfirming(true)}>Eliminar conversación</button>
        </div>
      </div>
      {confirming && (
        <div className="task-editor">
          <p>¿Eliminar la conversación con «{conversation.contact}»? Se borrarán sus {conversation.messages.length} mensajes de este navegador.</p>
          <div className="task-actions">
            <button type="button" onClick={onDelete}>Confirmar eliminación</button>
            <button type="button" onClick={() => setConfirming(false)} autoFocus>Cancelar eliminación</button>
          </div>
        </div>
      )}
      {conversation.messages.length === 0
        ? <p className="task-empty" role="status">Aún no hay mensajes. Escribe el primero.</p>
        : (
          <ol className="message-list" aria-label={`Mensajes con ${conversation.contact}`}>
            {conversation.messages.map(message => (
              <li key={message.id} className={message.author === 'me' ? 'message mine' : 'message'}>
                <p className="message-author">{message.author === 'me' ? 'Tú' : conversation.contact}</p>
                <p className="message-text">{message.text}</p>
                <time dateTime={message.sentAt}>{formatSentAt(message.sentAt)}</time>
              </li>
            ))}
          </ol>
        )}
      <MessageForm key={conversation.id} conversation={conversation} onSend={onSend} />
    </>
  );
}
