import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addSubject, assignTaskSubject, isSubjectList, mergeSubjects, removeSubject,
  renameSubject, replaceTaskSubject, summarizeSubjects, validateSubjectName,
} from '../src/lib/subjects.ts';
import { loadSubjects, saveSubjects, subjectStorageKey } from '../src/lib/subjectStorage.ts';
import { isTaskList } from '../src/lib/tasks.ts';

const tasks = [
  { id: '1', title: 'Leer capítulo', subject: 'Diseño', status: 'pending', dueDate: '2026-11-02' },
  { id: '2', title: 'Proyecto', subject: 'Diseño', status: 'completed' },
  { id: '3', title: 'Consultas', subject: 'Bases de Datos', status: 'progress' },
  { id: '4', title: 'Sin materia', status: 'pending' },
];

test('combina materias guardadas con las usadas en tareas sin duplicar', () => {
  assert.deepEqual(mergeSubjects(['Física', 'Diseño'], tasks), ['Física', 'Diseño', 'Bases de Datos']);
  assert.deepEqual(mergeSubjects([], [{ ...tasks[3], subject: '  ' }]), []);
});

test('valida nombres vacíos, largos y duplicados sin distinguir mayúsculas', () => {
  const subjects = ['Diseño'];
  assert.match(validateSubjectName('  ', subjects), /Escribe/);
  assert.match(validateSubjectName('a'.repeat(81), subjects), /máximo/);
  assert.match(validateSubjectName(' DISEÑO ', subjects), /Ya existe/);
  assert.equal(validateSubjectName('diseño', subjects, 'Diseño'), '');
  assert.deepEqual(addSubject(subjects, '  Física '), ['Diseño', 'Física']);
  assert.throws(() => addSubject(subjects, 'diseño'));
  assert.deepEqual(subjects, ['Diseño']);
});

test('renombra y elimina materias de forma inmutable', () => {
  const subjects = ['Diseño', 'Física'];
  assert.deepEqual(renameSubject(subjects, 'Diseño', ' Diseño UX '), ['Diseño UX', 'Física']);
  assert.throws(() => renameSubject(subjects, 'Diseño', 'física'));
  assert.deepEqual(removeSubject(subjects, 'Física'), ['Diseño']);
  assert.deepEqual(subjects, ['Diseño', 'Física']);
});

test('resume tareas totales y no completadas por materia', () => {
  assert.deepEqual(summarizeSubjects(['Diseño', 'Bases de Datos', 'Física'], tasks), [
    { name: 'Diseño', total: 2, pending: 1 },
    { name: 'Bases de Datos', total: 1, pending: 1 },
    { name: 'Física', total: 0, pending: 0 },
  ]);
});

test('asigna, cambia y quita materias conservando los demás datos de la tarea', () => {
  const assigned = assignTaskSubject(tasks, '4', ' Física ');
  assert.equal(assigned[3].subject, 'Física');
  assert.equal(tasks[3].subject, undefined);
  const cleared = assignTaskSubject(tasks, '1', '');
  assert.equal('subject' in cleared[0], false);
  assert.equal(cleared[0].dueDate, '2026-11-02');
  assert.throws(() => assignTaskSubject(tasks, '1', 'a'.repeat(81)));

  const renamed = replaceTaskSubject(tasks, 'Diseño', 'Diseño UX');
  assert.deepEqual(renamed.map(task => task.subject), ['Diseño UX', 'Diseño UX', 'Bases de Datos', undefined]);
  const removed = replaceTaskSubject(tasks, 'Diseño', '');
  assert.equal(removed.length, tasks.length);
  assert.equal(removed.filter(task => task.subject === undefined).length, 3);
  assert.equal(isTaskList(removed), true);
});

test('recupera materias válidas y usa fallback ante contenido corrupto o storage bloqueado', () => {
  let stored = null;
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem(key) { assert.equal(key, subjectStorageKey); return stored; },
      setItem(key, value) { assert.equal(key, subjectStorageKey); stored = value; },
    },
  });
  try {
    assert.deepEqual(loadSubjects([]), []);
    saveSubjects(['Diseño']);
    assert.deepEqual(loadSubjects([]), ['Diseño']);
    for (const invalid of ['{', '[null]', '[""]', '["A","A"]', '{"a":1}']) {
      stored = invalid; assert.deepEqual(loadSubjects(['X']), ['X']);
    }
    assert.equal(isSubjectList([]), true);
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true, get() { throw new Error('Storage bloqueado'); },
    });
    assert.deepEqual(loadSubjects(['X']), ['X']);
    assert.doesNotThrow(() => saveSubjects(['Diseño']));
  } finally {
    if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage);
    else delete globalThis.localStorage;
  }
});
