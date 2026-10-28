import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  countAllUnread, countUnread, createConversation, isConversationList, markConversationRead,
  removeConversation, sendMessage, validateContactName, validateMessageText,
} from '../src/lib/messages.ts';
import { loadConversations, messageStorageKey, saveConversations } from '../src/lib/messageStorage.ts';

const sentAt = '2026-10-28T12:00:00.000Z';
const conversations = [
  {
    id: 'a', contact: 'Prof. Méndez', role: 'Diseño',
    messages: [
      { id: 'a1', author: 'contact', text: 'Hola', sentAt },
      { id: 'a2', author: 'contact', text: 'Entrega el viernes', sentAt, read: true },
      { id: 'a3', author: 'me', text: 'Gracias', sentAt },
    ],
  },
  { id: 'b', contact: 'Equipo', messages: [{ id: 'b1', author: 'contact', text: '¿Listos?', sentAt }] },
];

test('cuenta mensajes sin leer por conversación y en total', () => {
  assert.equal(countUnread(conversations[0]), 1);
  assert.equal(countAllUnread(conversations), 2);
  const read = markConversationRead(conversations, 'a');
  assert.equal(countUnread(read[0]), 0);
  assert.equal(read[1], conversations[1]);
  assert.equal(countUnread(conversations[0]), 1);
  assert.equal(read[0].messages[2].read, undefined);
});

test('envía mensajes recortados, mueve la conversación al inicio y rechaza textos inválidos', () => {
  const sent = sendMessage(conversations, 'b', '  Sí  ', 'b2', sentAt);
  assert.deepEqual(sent.map(conversation => conversation.id), ['b', 'a']);
  assert.deepEqual(sent[0].messages.at(-1), { id: 'b2', author: 'me', text: 'Sí', sentAt });
  assert.equal(conversations[1].messages.length, 1);
  assert.match(validateMessageText('   '), /Escribe/);
  assert.match(validateMessageText('a'.repeat(1001)), /máximo/);
  assert.throws(() => sendMessage(conversations, 'b', ' ', 'x', sentAt));
  assert.throws(() => sendMessage(conversations, 'missing', 'Hola', 'x', sentAt));
});

test('crea conversaciones únicas y elimina solo la indicada', () => {
  const created = createConversation(conversations, '  Ana  ', 'c');
  assert.deepEqual(created[0], { id: 'c', contact: 'Ana', messages: [] });
  assert.match(validateContactName('equipo', conversations), /Ya tienes/);
  assert.match(validateContactName(' ', conversations), /Escribe/);
  assert.throws(() => createConversation(conversations, 'EQUIPO', 'd'));
  assert.deepEqual(removeConversation(created, 'c'), conversations);
  assert.deepEqual(removeConversation(conversations, 'missing'), conversations);
});

test('valida la estructura completa y admite una lista vacía', () => {
  assert.equal(isConversationList([]), true);
  assert.equal(isConversationList(conversations), true);
  const message = conversations[0].messages[0];
  for (const invalid of [null, [null], [conversations[0], conversations[0]],
    [{ ...conversations[1], contact: ' ' }], [{ ...conversations[1], messages: null }],
    [{ ...conversations[1], messages: [{ ...message, author: 'otro' }] }],
    [{ ...conversations[1], messages: [{ ...message, text: '' }] }],
    [{ ...conversations[1], messages: [{ ...message, sentAt: 'ayer' }] }],
    [{ ...conversations[1], messages: [{ ...message, read: 'no' }] }],
    [{ ...conversations[1], messages: [message, message] }]]) {
    assert.equal(isConversationList(invalid), false);
  }
});

test('recupera mensajes válidos y usa fallback ante contenido corrupto o storage bloqueado', () => {
  let stored = null;
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem(key) { assert.equal(key, messageStorageKey); return stored; },
      setItem(key, value) { assert.equal(key, messageStorageKey); stored = value; },
    },
  });
  try {
    assert.equal(loadConversations(conversations), conversations);
    saveConversations(conversations);
    assert.deepEqual(loadConversations([]), conversations);
    stored = '[]'; assert.deepEqual(loadConversations(conversations), []);
    stored = '{'; assert.equal(loadConversations(conversations), conversations);
    stored = '[null]'; assert.equal(loadConversations(conversations), conversations);
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true, get() { throw new Error('Storage bloqueado'); },
    });
    assert.equal(loadConversations(conversations), conversations);
    assert.doesNotThrow(() => saveConversations(conversations));
  } finally {
    if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage);
    else delete globalThis.localStorage;
  }
});
