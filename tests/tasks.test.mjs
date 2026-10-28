import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTask, countPendingTasks, filterTasks, isTaskList, updateTask, removeTask, scheduleTask } from '../src/lib/tasks.ts';
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

test('edita sin perder metadatos, cambia el contador y elimina solo la tarea indicada', () => {
  const original = [{ ...tasks[0], date: 'Mañana', urgent: true }, tasks[1]];
  const edited = updateTask(original, '1', { title: '  Repasar diseño  ', status: 'completed' });
  assert.deepEqual(edited[0], { ...original[0], title: 'Repasar diseño', status: 'completed' });
  assert.equal(countPendingTasks(edited), 1);
  assert.equal(original[0].title, 'Leer capítulo');
  assert.throws(() => updateTask(original, '1', { title: ' ', status: 'pending' }));
  assert.throws(() => updateTask(original, '1', { title: 'Título', status: 'invalid' }));
  assert.deepEqual(removeTask(edited, '1'), [tasks[1]]);
  assert.deepEqual(removeTask(edited, 'missing'), edited);
  assert.deepEqual(removeTask([tasks[0]], '1'), []);
});

test('programa entregas sin perder datos y valida fechas reales', () => {
  const scheduled = scheduleTask(tasks, '1', '2028-02-29');
  assert.equal(scheduled[0].dueDate, '2028-02-29');
  assert.equal(scheduled[0].subject, 'Diseño');
  assert.equal(tasks[0].dueDate, undefined);
  assert.deepEqual(scheduleTask(scheduled, '1', ''), tasks);
  for (const date of ['2026-02-29', '2026-04-31', 'ayer', '2026-1-01']) {
    assert.throws(() => scheduleTask(tasks, '1', date));
    assert.equal(isTaskList([{...tasks[0], dueDate:date}]), false);
  }
  assert.equal(isTaskList(scheduled), true);
});
