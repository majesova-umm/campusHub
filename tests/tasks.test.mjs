import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTask, countPendingTasks, filterTasks, isTaskList } from '../src/lib/tasks.ts';
import { loadTasks, saveTasks, taskStorageKey } from '../src/lib/taskStorage.ts';

const tasks = [
  { id: '1', title: 'Leer capítulo', subject: 'Diseño', status: 'pending' },
  { id: '2', title: 'Proyecto', status: 'progress' },
  { id: '3', title: 'Consultas', status: 'completed' },
];

test('crea tareas pendientes, normaliza el título y rechaza entradas inválidas', () => {
  assert.deepEqual(createTask('  Repasar  ', 'new'), {
    id: 'new', title: 'Repasar', status: 'pending',
  });
  assert.throws(() => createTask('  ', 'new'));
  assert.throws(() => createTask('a'.repeat(201), 'new'));
});

test('cuenta las no completadas y busca por título y materia sin distinguir mayúsculas', () => {
  assert.equal(countPendingTasks(tasks), 2);
  assert.deepEqual(filterTasks(tasks, 'DISEÑO'), [tasks[0]]);
  assert.deepEqual(filterTasks(tasks, 'proyecto'), [tasks[1]]);
  assert.deepEqual(filterTasks(tasks, 'ausente'), []);
  assert.deepEqual(filterTasks(tasks, ''), tasks);
});

test('valida el dominio completo y admite una lista vacía', () => {
  assert.equal(isTaskList([]), true);
  assert.equal(isTaskList(tasks), true);
  for (const invalid of [null, [null], [{ ...tasks[0], status: 'unknown' }],
    [{ ...tasks[0], subject: {} }], [{ ...tasks[0], date: 2 }],
    [{ ...tasks[0], urgent: 'true' }], [{ ...tasks[0], title: ' ' }],
    [tasks[0], tasks[0]]]) {
    assert.equal(isTaskList(invalid), false);
  }
});

test('recupera datos válidos y usa fallback ante contenido corrupto o storage bloqueado', () => {
  let stored = null;
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem(key) { assert.equal(key, taskStorageKey); return stored; },
      setItem(key, value) { assert.equal(key, taskStorageKey); stored = value; },
    },
  });
  try {
    assert.equal(loadTasks(tasks), tasks);
    saveTasks(tasks);
    assert.deepEqual(loadTasks([]), tasks);
    stored = '[]'; assert.deepEqual(loadTasks(tasks), []);
    stored = '{'; assert.equal(loadTasks(tasks), tasks);
    stored = '[null]'; assert.equal(loadTasks(tasks), tasks);
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true, get() { throw new Error('Storage bloqueado'); },
    });
    assert.equal(loadTasks(tasks), tasks);
    assert.doesNotThrow(() => saveTasks(tasks));
  } finally {
    if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage);
    else delete globalThis.localStorage;
  }
});
